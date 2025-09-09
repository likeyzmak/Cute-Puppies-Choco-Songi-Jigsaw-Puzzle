// This is our serverless function for handling the leaderboard.
// It runs on Netlify's servers, not in the browser.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

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

  try {
    await client.connect();
    const database = client.db("leaderboard_db"); // Use your desired database name
    const scoresCollection = database.collection("scores");

  // Handle GET request to fetch scores
  if (event.httpMethod === "GET") {
    try {
      const scores = await scoresCollection.find({}).sort({ score: -1 }).limit(MAX_LEADERBOARD_ENTRIES).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(scores),
      };
    } catch (error) {
      console.error("Error retrieving scores:", error);
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

      await scoresCollection.insertOne(newScore);

      // Get updated scores, sort, and trim
      const updatedScores = await scoresCollection.find({}).sort({ score: -1 }).limit(MAX_LEADERBOARD_ENTRIES).toArray();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, scores: updatedScores }),
      };
    } catch (error) {
      console.error("Error saving score:", error);
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
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to connect to database." }),
    };
  } finally {
    await client.close();
  }
};