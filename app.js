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
  const fakeData = Math.floor(Math.random() * 100);
  console.log("a user connected");

  socket.on("join", (id) => {
    socket.join(id);
    console.log("User has joined room: " + id);

    socket.emit("joined");
  });

  socket.on("create", (details) => {
    console.log(details);
    console.log(socket.id);

    // GENERATE PIN

    socket.emit("created", socket.id);
  });

  socket.on("getData", () => {
    // API CALL
    socket.emit("receiveData", fakeData);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
