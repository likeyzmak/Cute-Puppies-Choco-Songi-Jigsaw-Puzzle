document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const galleryScreen = document.getElementById('gallery-screen');
    const imageGallery = document.getElementById('image-gallery');
    const gameScreen = document.getElementById('game-screen');
    const puzzleBoard = document.getElementById('puzzle-board');
    const originalPreview = document.getElementById('original-preview');
    const difficultyLabel = document.getElementById('difficulty-label');
    const timerEl = document.getElementById('timer');
    const moveCounterEl = document.getElementById('move-counter');
    const currentPuzzleThumbnail = document.getElementById('current-puzzle-thumbnail');

    // Modals
    const difficultyModal = document.getElementById('difficulty-modal');
    const victoryModal = document.getElementById('victory-modal');
    const gameOverModal = document.getElementById('game-over-modal'); // Added

    // Buttons
    const shuffleBtn = document.getElementById('shuffle-btn');
    const hintBtn = document.getElementById('hint-btn');
    const originalViewBtn = document.getElementById('original-view-btn');
    const restartBtn = document.getElementById('restart-btn');
    const changeImageBtn = document.getElementById('change-image-btn');
    const changeDifficultyBtn = document.getElementById('change-difficulty-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    
    const victoryChangeImageBtn = document.getElementById('victory-change-image-btn');
    

    // Audio
    const bgmAudio = document.getElementById('bgm-audio');
    const fanfareAudio = document.getElementById('fanfare-audio');

    // Canvas for confetti
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    // --- Game Config ---
    const timeLimits = { // Added
        4: 120,    // 2 minutes
        6: 300,    // 5 minutes
        8: 600,    // 10 minutes
        12: 1200   // 20 minutes
    };

    // --- Game State ---
    let gameState = {
        imageSrc: '',
        gridSize: 0,
        perm: [],
        moves: 0,
        time: 0,
        timeLimit: 0, // Added
        timerInterval: null,
        isSoundOn: true,
        isGameActive: false,
        firstInteraction: false,
    };

    let tiles = [];
    let drag = null;

    const imageManifest = [
        'PUZZLE1.png', 'PUZZLE2.png', 'PUZZLE3.png', 'PUZZLE4.png', 'PUZZLE5.png',
        'PUZZLE6.png', 'PUZZLE7.png', 'PUZZLE8.png', 'PUZZLE10.png', 'PUZZLE11.png',
        'PUZZLE12.png', 'PUZZLE13.png', 'PUZZLE14.png', 'PUZZLE15.png', 'PUZZLE16.png',
        'PUZZLE79.png'
    ];

    // --- Initialization ---
    function init() {
        populateGallery();
        addEventListeners();
        updateSoundButtonUI();
    }

    function populateGallery() {
        imageGallery.innerHTML = '';
        imageManifest.forEach(filename => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumbnail';
            thumb.innerHTML = `<img src="assets/images/${filename}" alt="Puzzle thumbnail ${filename}">`;
            thumb.addEventListener('click', () => {
                handleFirstInteraction();
                selectImage(`assets/images/${filename}`);
            });
            imageGallery.appendChild(thumb);
        });
    }

    function addEventListeners() {
        document.body.addEventListener('pointerdown', handleFirstInteraction, { once: true });
        difficultyModal.addEventListener('click', handleDifficultyChoice);
        shuffleBtn.addEventListener('click', () => {
            shuffle(gameState.perm);
            if (isSolved()) shuffle(gameState.perm);
            applyPositions();
        });
        restartBtn.addEventListener('click', () => startGame(gameState.imageSrc, gameState.gridSize, false));
        hintBtn.addEventListener('click', showHint);
        originalViewBtn.addEventListener('click', showOriginalView);
        changeImageBtn.addEventListener('click', returnToGallery);
        victoryChangeImageBtn.addEventListener('click', returnToGallery);
        changeDifficultyBtn.addEventListener('click', () => showDifficultyModal(true));
        victoryChangeDifficultyBtn.addEventListener('click', () => showDifficultyModal(true));
        soundToggleBtn.addEventListener('click', toggleSound);
        
    }

    // --- Game Flow ---
    function selectImage(imageSrc) {
        gameState.imageSrc = imageSrc;
        showDifficultyModal();
    }

    function showDifficultyModal(isChange = false) {
        if (isChange) pauseTimer();
        difficultyModal.classList.remove('hidden');
    }

    function handleDifficultyChoice(e) {
        if (e.target.classList.contains('difficulty-btn')) {
            const newGridSize = parseInt(e.target.dataset.difficulty, 10);
            difficultyModal.classList.add('hidden');
            if (gameState.isGameActive && gameState.gridSize === newGridSize) {
                resumeTimer();
            } else {
                startGame(gameState.imageSrc, newGridSize);
            }
        }
    }

    function startGame(imageSrc, gridSize, isNewImage = true) {
        gameState.imageSrc = imageSrc;
        gameState.gridSize = gridSize;
        gameState.isGameActive = true;
        gameState.timeLimit = timeLimits[gridSize] || 0; // Set time limit
        gameState.time = gameState.timeLimit; // Set initial time

        galleryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        hideVictoryModal();
        hideGameOverModal(); // Ensure game over modal is hidden

        if (isNewImage) {
            currentPuzzleThumbnail.src = imageSrc;
            originalPreview.src = imageSrc;
        }

        difficultyLabel.textContent = `Difficulty: ${gridSize} × ${gridSize}`;
        resetStats();
        createPuzzle();
        startTimer();
        playBGM();
    }

    function returnToGallery() {
        gameState.isGameActive = false;
        gameScreen.classList.add('hidden');
        galleryScreen.classList.remove('hidden');
        hideVictoryModal();
        hideGameOverModal(); // Ensure game over modal is hidden
        stopTimer();
        pauseBGM();
    }

    // --- Puzzle Creation & Positioning ---
    function createPuzzle() {
        puzzleBoard.innerHTML = '';
        tiles = [];
        const boardSize = Math.min(window.innerWidth * 0.9, 500);
        puzzleBoard.style.setProperty('--board-size', `${boardSize}px`);
        puzzleBoard.style.setProperty('--tile-size', `${boardSize / gameState.gridSize}px`);

        const pieceCount = gameState.gridSize * gameState.gridSize;
        gameState.perm = Array.from({ length: pieceCount }, (_, i) => i);
        shuffle(gameState.perm);
        if (isSolved()) shuffle(gameState.perm);

        for (let pieceIndex = 0; pieceIndex < pieceCount; pieceIndex++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.dataset.pieceIndex = pieceIndex;
            tile.setAttribute('role', 'button');
            
            const row = Math.floor(pieceIndex / gameState.gridSize);
            const col = pieceIndex % gameState.gridSize;
            tile.style.backgroundImage = `url(${gameState.imageSrc})`;
            tile.style.backgroundPosition = `${(col * 100) / (gameState.gridSize - 1)}% ${(row * 100) / (gameState.gridSize - 1)}%`;
            tile.style.backgroundSize = `${boardSize}px ${boardSize}px`;

            tile.addEventListener('pointerdown', onPointerDown);
            puzzleBoard.appendChild(tile);
            tiles[pieceIndex] = tile;
        }
        applyPositions();
    }

    function applyPositions() {
        const { gridSize } = gameState;
        gameState.perm.forEach((pieceIndex, cellIndex) => {
            const tileEl = tiles[pieceIndex];
            const r = Math.floor(cellIndex / gridSize);
            const c = cellIndex % gridSize;
            tileEl.style.transform = `translate3d(${c * 100}%, ${r * 100}%, 0)`;
            tileEl.dataset.gridIndex = cellIndex;
            tileEl.setAttribute('aria-label', `Tile ${pieceIndex + 1}, currently at row ${r + 1} column ${c + 1}`);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isSolved() {
        return gameState.perm.every((val, index) => val === index);
    }

    // --- Drag & Swap Logic ---
    function onPointerDown(e) {
        if (!gameState.isGameActive) return;
        const tileEl = e.currentTarget;
        const startIdx = +tileEl.dataset.gridIndex;
        tileEl.setPointerCapture(e.pointerId);
        const boardRect = puzzleBoard.getBoundingClientRect();
        const { width: w, height: h } = tileEl.getBoundingClientRect();
        tileEl.classList.add('dragging');
        drag = { pointerId: e.pointerId, tileEl, startIdx, boardRect, w, h, hoverEl: null };
        tileEl.style.pointerEvents = 'none';
        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp, { once: true });
    }

    function onPointerMove(e) {
        if (!drag || e.pointerId !== drag.pointerId) return;
        e.preventDefault();
        const x = e.clientX - drag.boardRect.left;
        const y = e.clientY - drag.boardRect.top;
        drag.tileEl.style.transform = `translate3d(${x - drag.w / 2}px, ${y - drag.h / 2}px, 0)`;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const hoverEl = el ? el.closest('.puzzle-tile') : null;
        if (drag.hoverEl && drag.hoverEl !== hoverEl) {
            drag.hoverEl.classList.remove('drop-target');
        }
        if (hoverEl && hoverEl !== drag.tileEl) {
            hoverEl.classList.add('drop-target');
            drag.hoverEl = hoverEl;
        } else {
            drag.hoverEl = null;
        }
    }

    function onPointerUp(e) {
        if (!drag || e.pointerId !== drag.pointerId) return;
        drag.tileEl.style.pointerEvents = '';
        drag.tileEl.classList.remove('dragging');
        let targetIdx = null;
        if (drag.hoverEl) {
            targetIdx = +drag.hoverEl.dataset.gridIndex;
            drag.hoverEl.classList.remove('drop-target');
        } else {
            const { gridSize } = gameState;
            const cellSize = drag.boardRect.width / gridSize;
            const boardX = e.clientX - drag.boardRect.left;
            const boardY = e.clientY - drag.boardRect.top;
            if (boardX >= 0 && boardY >= 0 && boardX < drag.boardRect.width && boardY < drag.boardRect.height) {
                const c = Math.floor(boardX / cellSize);
                const r = Math.floor(boardY / cellSize);
                targetIdx = r * gridSize + c;
            }
        }
        if (targetIdx !== null && targetIdx !== drag.startIdx) {
            swapTiles(drag.startIdx, targetIdx);
        } else {
            applyPositions();
        }
        window.removeEventListener('pointermove', onPointerMove, { passive: false });
        drag = null;
    }

    function swapTiles(idxA, idxB) {
        [gameState.perm[idxA], gameState.perm[idxB]] = [gameState.perm[idxB], gameState.perm[idxA]];
        applyPositions();
        incrementMoves();
        clearHints();
        if (isSolved()) handleWin();
    }

    // --- UI & Stats ---
    function formatTime(seconds) { // Helper function
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    function resetStats() {
        gameState.moves = 0;
        gameState.time = gameState.timeLimit; // Reset to full time
        moveCounterEl.textContent = '0';
        timerEl.textContent = formatTime(gameState.time); // Format initial time
        stopTimer();
    }

    function incrementMoves() {
        gameState.moves++;
        moveCounterEl.textContent = gameState.moves;
    }

    function startTimer() {
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        if (gameState.timeLimit === 0) { // If no time limit, behave as before (count up)
            gameState.time = 0;
            gameState.timerInterval = setInterval(() => {
                gameState.time++;
                timerEl.textContent = formatTime(gameState.time);
            }, 1000);
        } else { // Countdown logic
            gameState.timerInterval = setInterval(() => {
                gameState.time--;
                timerEl.textContent = formatTime(gameState.time);
                if (gameState.time <= 0) {
                    timerEl.textContent = formatTime(0);
                    handleGameOver();
                }
            }, 1000);
        }
    }

    function stopTimer() { clearInterval(gameState.timerInterval); }
    function pauseTimer() { clearInterval(gameState.timerInterval); }
    function resumeTimer() { if (gameState.isGameActive) startTimer(); }

    // --- Features (Hint, Original View) ---
    let hintTimeout = null;
    function showHint() {
            clearHints();
            const misplacedCell = gameState.perm.findIndex((piece, cell) => piece !== cell); // Cell index that is wrong
            if (misplacedCell === -1) return; // Puzzle is solved

            const pieceId = gameState.perm[misplacedCell]; // The piece (original index) currently at misplacedCell
            const correctDestinationCell = pieceId; // The cell where this piece should ultimately go

            // Highlight the piece that is currently at the misplaced cell
            const sourceTileEl = puzzleBoard.querySelector(`[data-grid-index="${misplacedCell}"]`);

            // Highlight the cell where this piece should ultimately go
            const targetTileEl = puzzleBoard.querySelector(`[data-grid-index="${correctDestinationCell}"]`);

            sourceTileEl.classList.add('hint-source');
            targetTileEl.classList.add('hint-target');
            hintTimeout = setTimeout(clearHints, 3000);
        }

    function clearHints() {
        clearTimeout(hintTimeout);
        document.querySelectorAll('.hint-source, .hint-target').forEach(el => el.classList.remove('hint-source', 'hint-target'));
    }

    function showOriginalView() {
        originalPreview.classList.add('emphasized');
        setTimeout(() => originalPreview.classList.remove('emphasized'), 2000);
    }

    // --- Win & Game Over Condition ---
    function handleWin() {
        stopTimer();
        gameState.isGameActive = false;
        const timeTaken = gameState.timeLimit > 0 ? gameState.timeLimit - gameState.time : gameState.time;
        document.getElementById('victory-time').textContent = formatTime(timeTaken);
        document.getElementById('victory-moves').textContent = gameState.moves;
        victoryModal.classList.remove('hidden');
        playFanfare();
        runConfetti();
    }

    function hideVictoryModal() {
        victoryModal.classList.add('hidden');
        stopConfetti();
    }

    function handleGameOver() { // Added
        stopTimer();
        gameState.isGameActive = false;
        gameOverModal.classList.remove('hidden');
        pauseBGM();
        setTimeout(() => {
            returnToGallery(); // This already hides the modal
        }, 3000);
    }

    function hideGameOverModal() { // Added
        gameOverModal.classList.add('hidden');
    }

    // --- Audio Control ---
    function handleFirstInteraction() {
        if (gameState.firstInteraction) return;
        gameState.firstInteraction = true;
        // Unlock audio context
        bgmAudio.play().then(() => {
            if (gameState.isGameActive) {
                playBGM();
            } else {
                bgmAudio.pause();
            }
        }).catch(() => {});
        fanfareAudio.play().then(() => fanfareAudio.pause()).catch(() => {});
    }

    function toggleSound() {
        gameState.isSoundOn = !gameState.isSoundOn;
        updateSoundButtonUI();
        if (gameState.isSoundOn) {
            if (gameState.isGameActive) playBGM();
        } else {
            pauseBGM();
        }
    }

    function updateSoundButtonUI() {
        if (gameState.isSoundOn) {
            soundToggleBtn.classList.remove('muted');
            soundToggleBtn.textContent = '🎵';
        } else {
            soundToggleBtn.classList.add('muted');
            soundToggleBtn.textContent = '🔇';
        }
    }

    function playBGM() {
        if (gameState.isSoundOn && gameState.firstInteraction) {
            bgmAudio.play().catch(e => console.error('BGM play failed', e));
        }
    }

    function pauseBGM() { bgmAudio.pause(); }

    function playFanfare() {
        if (gameState.isSoundOn && gameState.firstInteraction) {
            pauseBGM();
            fanfareAudio.currentTime = 0;
            fanfareAudio.play().catch(e => console.error('Fanfare play failed', e));
        }
    }

    // --- Confetti Animation ---
    let confettiAnimationId;
    let confettiParticles = [];
    const confettiColors = ['#ffc1cc', '#a2d2ff', '#bde0fe', '#ff8fab', '#fcf6bd', '#d0f4de', '#c7bfff'];

    function runConfetti() {
        const boardRect = puzzleBoard.getBoundingClientRect();
        confettiCanvas.width = boardRect.width;
        confettiCanvas.height = boardRect.height;
        confettiParticles = [];
        for (let i = 0; i < 150; i++) confettiParticles.push(createConfettiParticle());
        animateConfetti();
    }

    function createConfettiParticle() {
        return {
            x: Math.random() * confettiCanvas.width,
            y: -Math.random() * 20,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 2 + 1,
            angle: Math.random() * Math.PI * 2,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            shape: Math.random() > 0.5 ? 'circle' : 'rect'
        };
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach((p, i) => {
            p.y += p.speed;
            p.x += Math.sin(p.y / 10) * 0.5;
            if (p.y > confettiCanvas.height) {
                confettiParticles.splice(i, 1);
            } else {
                ctx.save();
                ctx.fillStyle = p.color;
                ctx.globalAlpha = (confettiCanvas.height - p.y) / confettiCanvas.height;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                ctx.restore();
            }
        });
        if (confettiParticles.length > 0) {
            confettiAnimationId = requestAnimationFrame(animateConfetti);
        } else {
            stopConfetti();
        }
    }

    function stopConfetti() {
        cancelAnimationFrame(confettiAnimationId);
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // --- Start the app ---
    init();
});