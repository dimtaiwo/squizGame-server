const Score = require("../models/scoreModel");

async function saveScore(points, username, roomId) {
  try {
    const newScore = await new Score({
      points: points,
      username: username,
      room: roomId,
    });
    await newScore.save();
  } catch (error) {
    console.error(error);
  }
}

async function getScore(room) {
  try {
    const scores = await Score.find({ room: room });
    return scores;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { saveScore, getScore };
