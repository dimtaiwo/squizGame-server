const Score = require("./models/scoreModel");
const express = require("express");

const router = express.Router();

router.get("/scores", async (req, res) => {
  try {
    const data = await Score.find().limit(15).sort({ points: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.send("Server error " + error);
  }
});

module.exports = router;
