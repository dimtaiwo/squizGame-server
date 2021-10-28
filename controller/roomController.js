const Room = require("../models/roomModel");
const { fetchData } = require("../fetchData");

async function saveData(roomId, topic, difficulty, question, players) {
  const results = await fetchData(topic, difficulty.toLowerCase(), question);

  const RoomData = new Room({
    room: roomId,
    questions: results,
    isValid: false,
    players: players,
    difficulty: difficulty,
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

async function getDifficulty(id) {
  try {
    const data = await Room.findOne({ room: id });
    const difficulty = data.difficulty;
    return difficulty;
  } catch (error) {
    console.error(error);
  }
}

async function getTopic(id) {
  try {
    const data = await Room.findOne({ room: id });
    console.log("data from gettopic" + data);
    return data.questions[0].category;
  } catch (error) {
    console.error(error);
  }
}

async function getRoom() {
  const data = await Room.find();
  console.log(data);
}
module.exports = {
  saveData,
  getQuestions,
  getPlayer,
  getDifficulty,
  getRoom,
  getTopic,
};
