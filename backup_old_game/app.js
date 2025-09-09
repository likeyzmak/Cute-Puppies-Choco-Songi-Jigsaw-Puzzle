document.addEventListener('DOMContentLoaded', () => {
    

    function hideLeaderboard() {
        leaderboardModal.classList.add('hidden');
    }

    function hideGameOverModal() {
        gameOverModal.classList.add('hidden');
    }



    async function showLeaderboard() {
        leaderboardModal.classList.remove('hidden');
        const leaderboardTableContainer = document.getElementById('leaderboard-table-container');
        leaderboardTableContainer.innerHTML = '<p style="text-align: center;">리더보드 불러오는 중...</p>';

        try {
            const response = await fetch('/api/leaderboard');
            if (response.ok) {
                const scores = await response.json();
                renderLeaderboard(scores);
            } else {
                leaderboardTableContainer.innerHTML = '<p style="text-align: center; color: red;">리더보드를 불러오는데 실패했습니다.</p>';
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            leaderboardTableContainer.innerHTML = '<p style="text-align: center; color: red;">네트워크 오류가 발생했습니다.</p>';
        }
    }

    function renderLeaderboard(scores) {
        const leaderboardTableContainer = document.getElementById('leaderboard-table-container');
        if (scores.length === 0) {
            leaderboardTableContainer.innerHTML = '<p style="text-align: center;">아직 등록된 점수가 없습니다.</p>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Nickname</th>
                        <th>Score</th>
                        <th>Difficulty</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Emotion</th>
                    </tr>
                </thead>
                <tbody>
        `;

        scores.forEach((score, index) => {
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${score.nickname}</td>
                    <td>${score.score}</td>
                    <td>${score.difficulty}</td>
                    <td>${score.time}</td>
                    <td>${score.date}</td>
                    <td>${score.emotion}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        leaderboardTableContainer.innerHTML = tableHTML;
    }

    async function showLeaderboard() {
        leaderboardModal.classList.remove('hidden');
        const leaderboardTableContainer = document.getElementById('leaderboard-table-container');
        leaderboardTableContainer.innerHTML = '<p style="text-align: center;">리더보드 불러오는 중...</p>';

        try {
            const response = await fetch('/api/leaderboard');
            if (response.ok) {
                const scores = await response.json();
                renderLeaderboard(scores);
            } else {
                leaderboardTableContainer.innerHTML = '<p style="text-align: center; color: red;">리더보드를 불러오는데 실패했습니다.</p>';
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            leaderboardTableContainer.innerHTML = '<p style="text-align: center; color: red;">네트워크 오류가 발생했습니다.</p>';
        }
    }

    function renderLeaderboard(scores) {
        const leaderboardTableContainer = document.getElementById('leaderboard-table-container');
        if (scores.length === 0) {
            leaderboardTableContainer.innerHTML = '<p style="text-align: center;">아직 등록된 점수가 없습니다.</p>';
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Nickname</th>
                        <th>Score</th>
                        <th>Difficulty</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Emotion</th>
                    </tr>
                </thead>
                <tbody>
        `;

        scores.forEach((score, index) => {
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${score.nickname}</td>
                    <td>${score.score}</td>
                    <td>${score.difficulty}</td>
                    <td>${score.time}</td>
                    <td>${score.date}</td>
                    <td>${score.emotion}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        leaderboardTableContainer.innerHTML = tableHTML;
    }
    function hideLeaderboard() {
        leaderboardModal.classList.add('hidden');
    }

    async function registerScore() {
        const nickname = prompt('등록할 닉네임을 적어 주세요');
        if (!nickname || !nickname.trim()) {
            alert('닉네임이 유효하지 않습니다.');
            return;
        }

        const scoreData = {
            nickname: nickname.trim(),
            score: gameState.finalScore,
            difficulty: `${gameState.gridSize}x${gameState.gridSize}`,
            time: formatTime(gameState.timeLimit > 0 ? gameState.timeLimit - gameState.time : gameState.time),
            date: new Date().toLocaleDateString(),
            emotion: gameState.emotionText,
        };

        try {
            const response = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scoreData),
            });

            if (response.ok) {
                alert('점수가 등록되었습니다!');
                registerScoreBtn.disabled = true;
                showLeaderboard();
            } else {
                const errorData = await response.json();
                alert(`점수 등록 실패: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Error registering score:', error);
            alert('점수 등록 중 오류가 발생했습니다.');
        }
    }
    

    
    

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
    const gameOverModal = document.getElementById('game-over-modal');
    const leaderboardModal = document.getElementById('leaderboard-modal');

    // Buttons
    const shuffleBtn = document.getElementById('shuffle-btn');
    const hintBtn = document.getElementById('hint-btn'); // This is the top bar hint button
    const viewRankingsBtn = document.getElementById('view-rankings-btn'); // New button in controls
    const originalViewBtn = document.getElementById('original-view-btn');
    const restartBtn = document.getElementById('restart-btn');
    const changeImageBtn = document.getElementById('change-image-btn');
    const changeDifficultyBtn = document.getElementById('change-difficulty-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    
    const victoryChangeImageBtn = document.getElementById('victory-change-image-btn');
    const victoryScoreEl = document.getElementById('victory-score');
    const victoryEmotionIconEl = document.getElementById('victory-emotion-icon'); // New emotion icon element

    // Leaderboard Buttons
    const registerScoreBtn = document.getElementById('register-score-btn');
    const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
    const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
    const leaderboardChangeImageBtn = document.getElementById('leaderboard-change-image-btn');

    // Audio
    const bgmAudio = document.getElementById('bgm-audio');
    const fanfareAudio = document.getElementById('fanfare-audio');
    const comboAudio = document.getElementById('combo-audio');

    // Canvas for confetti
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas.getContext('2d');

    // --- Game Config ---
    const timeLimits = {
        3: 60,     // 1 minute
        4: 120,    // 2 minutes
        6: 300,    // 5 minutes
        10: 900    // 15 minutes
    };

    // Scoring config updated to a 100-point scale
    const scoringConfig = {
        3: { baseScore: 100, movePenalty: 1 },
        4: { baseScore: 100, movePenalty: 0.9 },
        6: { baseScore: 100, movePenalty: 0.7 },
        10: { baseScore: 100, movePenalty: 0.5 }
    };

    

    // --- Game State ---
    let gameState = {
        imageSrc: '',
        gridSize: 0,
        perm: [],
        moves: 0,
        time: 0,
        timeLimit: 0,
        timerInterval: null,
        isSoundOn: true,
        isGameActive: false,
        firstInteraction: false,
        finalScore: 0,
        emotionText: '', // Changed from emotionIcon to emotionText
    };

    let tiles = [];
    let drag = null;

    const imageManifest = [
        'PUZZLE1.png', 'PUZZLE2.png', 'PUZZLE3.png', 'PUZZLE4.png', 'PUZZLE5.png',
        'PUZZLE6.png', 'PUZZLE7.png', 'PUZZLE8.png', 'puzzle9.png', 'PUZZLE10.png', 'PUZZLE11.png',
        'PUZZLE12.png', 'PUZZLE13.png', 'PUZZLE14.png', 'PUZZLE15.png', 'PUZZLE16.png'
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
        hintBtn.addEventListener('click', showHint); // Top bar hint button
        if (viewRankingsBtn) viewRankingsBtn.addEventListener('click', showLeaderboard); // New controls panel button
        originalViewBtn.addEventListener('click', showOriginalView);
        changeImageBtn.addEventListener('click', returnToGallery);
        victoryChangeImageBtn.addEventListener('click', returnToGallery);
        changeDifficultyBtn.addEventListener('click', () => showDifficultyModal(true));
        soundToggleBtn.addEventListener('click', toggleSound);
        
        // Leaderboard listeners
        registerScoreBtn.addEventListener('click', registerScore);
        viewLeaderboardBtn.addEventListener('click', showLeaderboard);
        closeLeaderboardBtn.addEventListener('click', hideLeaderboard);
        leaderboardChangeImageBtn.addEventListener('click', () => {
            console.log('Change Image button on leaderboard clicked!');
            returnToGallery();
        });
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
        gameState.timeLimit = timeLimits[gridSize] || 0;
        gameState.time = gameState.timeLimit;

        galleryScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        hideVictoryModal();
        hideGameOverModal();
        hideLeaderboard();

        if (isNewImage) {
            currentPuzzleThumbnail.src = imageSrc;
            originalPreview.src = imageSrc;
        }

        difficultyLabel.textContent = `Difficulty: ${gridSize} × ${gridSize}`;
        resetStats();
        createPuzzle();
        startTimer();
        playBGM();

        // Scroll to the puzzle board
        setTimeout(() => {
            const puzzleBoardElement = document.getElementById('puzzle-board-container');
            if (puzzleBoardElement) {
                puzzleBoardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100); // A small delay to ensure the layout is stable
    }

    function returnToGallery() {
        gameState.isGameActive = false;
        gameScreen.classList.add('hidden');
        galleryScreen.classList.remove('hidden');
        hideVictoryModal();
        hideGameOverModal();
        hideLeaderboard();
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
        }
        else {
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
        playComboSound(); // Play combo sound on successful swap
        if (isSolved()) handleWin();
    }

    // --- UI & Stats ---
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    function resetStats() {
        gameState.moves = 0;
        gameState.time = gameState.timeLimit;
        moveCounterEl.textContent = '0';
        timerEl.textContent = formatTime(gameState.time);
        stopTimer();
        registerScoreBtn.disabled = true;
    }

    function incrementMoves() {
        gameState.moves++;
        moveCounterEl.textContent = gameState.moves;
    }

    function startTimer() {
        if (gameState.timerInterval) clearInterval(gameState.timerInterval);
        if (gameState.timeLimit === 0) {
            gameState.time = 0;
            gameState.timerInterval = setInterval(() => {
                gameState.time++;
                timerEl.textContent = formatTime(gameState.time);
            }, 1000);
        } else {
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
    let hintTargetEl = null;

    function showHint() {
        clearHints();
        const misplacedCell = gameState.perm.findIndex((piece, cell) => piece !== cell);
        if (misplacedCell === -1) return;

        const pieceId = gameState.perm[misplacedCell];
        const correctDestinationCell = pieceId;

        const sourceTileEl = puzzleBoard.querySelector(`[data-grid-index="${misplacedCell}"]`);
        sourceTileEl.classList.add('hint-source');

        hintTargetEl = document.createElement('div');
        hintTargetEl.classList.add('hint-target-cell');

        const boardSize = parseFloat(puzzleBoard.style.getPropertyValue('--board-size'));
        const tileSize = boardSize / gameState.gridSize;

        const targetRow = Math.floor(correctDestinationCell / gameState.gridSize);
        const targetCol = correctDestinationCell % gameState.gridSize;

        hintTargetEl.style.width = `${tileSize}px`;
        hintTargetEl.style.height = `${tileSize}px`;
        hintTargetEl.style.left = `${targetCol * tileSize}px`;
        hintTargetEl.style.top = `${targetRow * tileSize}px`;

        puzzleBoard.appendChild(hintTargetEl);

        hintTimeout = setTimeout(clearHints, 3000);
    }

    function clearHints() {
        clearTimeout(hintTimeout);
        document.querySelectorAll('.hint-source').forEach(el => el.classList.remove('hint-source'));
        if (hintTargetEl && hintTargetEl.parentNode) {
            hintTargetEl.parentNode.removeChild(hintTargetEl);
            hintTargetEl = null;
        }
    }

    function showOriginalView() {
        originalPreview.classList.add('emphasized');
        setTimeout(() => originalPreview.classList.remove('emphasized'), 2000);
    }

    // --- Win & Game Over Condition ---
    function getEmotionText(score) {
        if (score > 70) return '🌟👏 Great Job!';
        if (score > 40) return '😐🤔 So-so';
        return '😵❌ Failed!';
    }

    function handleWin() {
        stopTimer();
        gameState.isGameActive = false;
        const timeTaken = gameState.timeLimit > 0 ? gameState.timeLimit - gameState.time : gameState.time;
        document.getElementById('victory-time').textContent = formatTime(timeTaken);
        document.getElementById('victory-moves').textContent = gameState.moves;

        const config = scoringConfig[gameState.gridSize];
        let finalScore = 0;
        if (config) {
            finalScore = Math.max(0, config.baseScore - (gameState.moves * config.movePenalty) - timeTaken);
        }
        gameState.finalScore = Math.round(finalScore);
        gameState.emotionText = getEmotionText(gameState.finalScore);

        victoryScoreEl.textContent = gameState.finalScore;
        victoryEmotionIconEl.textContent = gameState.emotionText;

        registerScoreBtn.disabled = false;
        victoryModal.classList.remove('hidden');
        playFanfare();
        runConfetti();
    }

    function hideVictoryModal() {
        victoryModal.classList.add('hidden');
        stopConfetti();
    }

    function handleGameOver() {
        stopTimer();
        gameState.isGameActive = false;
        gameOverModal.classList.remove('hidden');
        pauseBGM();
        setTimeout(() => {
            returnToGallery();
        }, 3000);
    }

    

    

    // --- Audio Control ---
    function handleFirstInteraction() {
        if (gameState.firstInteraction) return;
        gameState.firstInteraction = true;
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

    function playComboSound() {
        if (gameState.isSoundOn) {
            comboAudio.currentTime = 0; // Rewind to start
            comboAudio.play().catch(e => console.error('Combo sound play failed', e));
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