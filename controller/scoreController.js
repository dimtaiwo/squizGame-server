const Score = require("../models/scoreModel");

async function saveScore(points, username, roomId) {
  const newScore = await new Score({
    points: points,
    username: username,
    room: roomId,
  });

  await newScore.save();
}

async function getScore(room) {
  const scores = await Score.find({ room: room });
  return scores;
}

module.exports = { saveScore, getScore };
