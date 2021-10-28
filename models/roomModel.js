const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room: String,
  questions: [],
  isValid: Boolean,
  players: Number,
  difficulty: String,
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
