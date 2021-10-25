const express = require("express");
const socketIo = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
