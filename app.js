const express = require("express");
const socketIo = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { fetchData } = require("./fetchdata");
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("data", async (details) => {
    console.log(details.difficulty);
    const trivia = await fetchData(
      details.topic,
      details.difficulty.toLowerCase(),
      details.questions
    );
    console.log(trivia);
    socket.emit("trivia", trivia);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
