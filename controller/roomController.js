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
  //   Room.find({ room: id }, (error, data) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(data);
  //     }
  //   });
  console.log("Getting questions... for id: " + id);
  const data = await Room.findOne({ room: id });
  return data;
};

const getPlayer = async (id) => {
  const data = await Room.findOne({ room: id });
  return data.players;
};

module.exports = { saveData, getQuestions, getPlayer };
