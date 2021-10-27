const express = require("express");
const socketIo = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { fetchData } = require("./fetchdata");
const { saveData, getQuestions } = require("./controller/roomController");

const { instrument } = require("@socket.io/admin-ui");

// getQuestions("P_c18qtDjR2q1WdAAAAr");

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
  console.log("a user connected to " + socket.id);

  socket.on("join", async (id) => {
    socket.join(id);
    console.log("User has JOINED room: " + id);

    const gameQuestions = await getQuestions(id);
    console.log(gameQuestions);

    socket.emit("joined", id, gameQuestions);
  });

  socket.on("create", async (details) => {
    console.log(details);
    // const gameId = socket.id;
    // console.log(gameId);

    await saveData(
      socket.id,
      details.topic,
      details.difficulty,
      details.questions
    );

    socket.emit("created", socket.id);
  });

  socket.on("getData", async (id) => {
    console.log("THE ID IS: " + id)
    // API CALL
    const gameQuestions = await getQuestions(id);
    console.log(gameQuestions);
    socket.emit("receiveData", gameQuestions);
    socket.to(id).emit("sendQuestions", gameQuestions);
  });

  socket.on("result", (data) => {
    // SAVE THE RESULT TO DB
    console.log(`${data.username} has scored ${data.points} points`);

    // FETCH ALL SCORES FOR THIS LOBBY
    const d = [{ username: 'Dim', points: 16 }, { username: 'Velin', points: 20 }];
    // GIVE BACK ALL THE SCORES

    io.to(data.room).emit("updatedResults", d);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

instrument(io, { auth: false });

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
