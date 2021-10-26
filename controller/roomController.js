const Room = require("../models/roomModel");
const { fetchData } = require("../fetchData");

async function saveData(roomId, topic, difficulty, question) {
  const results = await fetchData(topic, difficulty.toLowerCase(), question);
  console.log(results);

  const RoomData = new Room({
    room: roomId,
    questions: results,
    isValid: true,
  });

  await RoomData.save();
}

module.exports = { saveData };
