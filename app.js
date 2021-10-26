const express = require("express");
const socketIo = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { fetchData } = require("./fetchdata");
const { saveData, getQuestions } = require("./controller/roomController");

const { instrument } = require("@socket.io/admin-ui");

//getQuestions("P_c18qtDjR2q1WdAAAAr");

const db = require("./db");

db();
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (id) => {
    socket.join(id);
    console.log("User has joined room: " + id);

    socket.emit("joined", socket.id);
  });

  socket.on("create", async (details) => {
    console.log(details);
    const gameId = socket.id;

    await saveData(
      gameId,
      details.topic,
      details.difficulty,
      details.questions
    );

    socket.emit("created", gameId);
  });

  socket.on("getData", () => {
    // API CALL
    socket.emit("receiveData", fakeData);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

instrument(io, { auth: false });

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
