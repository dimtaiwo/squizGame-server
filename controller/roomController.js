const Room = require("../models/roomModel");
const { fetchData } = require("../fetchData");

async function saveData(roomId, topic, difficulty, question, players) {
  const results = await fetchData(topic, difficulty.toLowerCase(), question);

  const RoomData = new Room({
    room: roomId,
    questions: results,
    isValid: false,
    players: players,
  });

  await RoomData.save();
}

const getQuestions = async (id) => {
  try {
    const data = await Room.findOne({ room: id });
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getPlayer = async (id) => {
  try {
    const data = await Room.findOne({ room: id });
    return data.players;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { saveData, getQuestions, getPlayer };
