const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  username: String,
  points: String,
  room: String,
  difficulty: { type: String, required: true },
  topic: String,
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
