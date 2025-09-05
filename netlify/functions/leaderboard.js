// This is our serverless function for handling the leaderboard.
// It runs on Netlify's servers, not in the browser.

import { getStore } from "@netlify/blobs";

const LEADERBOARD_STORE_KEY = "scores";
const MAX_LEADERBOARD_ENTRIES = 50;

export const handler = async (event) => {
  // Set up CORS headers to allow requests from our game's URL
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow any origin
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Respond to preflight CORS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  const store = getStore("leaderboard");

  // Handle GET request to fetch scores
  if (event.httpMethod === "GET") {
    try {
      const scores = await store.get(LEADERBOARD_STORE_KEY, { type: "json" }) || [];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(scores),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to retrieve scores." }),
      };
    }
  }

  // Handle POST request to add a new score
  if (event.httpMethod === "POST") {
    try {
      const newScore = JSON.parse(event.body);

      // Basic validation for the new score
      if (!newScore || typeof newScore.nickname !== 'string' || typeof newScore.score !== 'number') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid score data." }),
        };
      }

      // Get current scores, add the new one, sort, and trim
      const currentScores = await store.get(LEADERBOARD_STORE_KEY, { type: "json" }) || [];
      currentScores.push(newScore);
      currentScores.sort((a, b) => b.score - a.score); // Sort descending
      const updatedScores = currentScores.slice(0, MAX_LEADERBOARD_ENTRIES); // Keep top 50

      // Save the updated list back to the blob store
      await store.setJSON(LEADERBOARD_STORE_KEY, updatedScores);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, scores: updatedScores }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to save score." }),
      };
    }
  }

  // Handle other methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};