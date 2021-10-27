const express = require("express");
const socketIo = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { fetchData } = require("./fetchdata");
const { saveData, getQuestions } = require("./controller/roomController");
const { saveScore, getScore } = require("./controller/scoreController");

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

const globalRooms = {};
const globalMaxPlayers = {};

const setMax = async (id, max) => {
  globalMaxPlayers[id] = max;
};

io.on("connection", (socket) => {
  console.log("a user connected to " + socket.id);

  socket.on("join", async (id) => {

    console.log("MAX PLAYERS ALLOWED: " + globalMaxPlayers[id]);

    if (!globalRooms[id]) {
      globalRooms[id] = 1;
    } else if (globalRooms[id] < globalMaxPlayers[id]) {
      globalRooms[id] += 1;
    } else {
      console.log("The room is full!");
      socket.emit("roomFull", globalRooms[id]);
      return;
    }

    // console.log("The room has: " + globalRooms[id] + "players");

    socket.join(id);
    console.log("User has JOINED room: " + id);

    const gameQuestions = await getQuestions(id);
    // console.log(gameQuestions);

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
      details.questions,
      details.players
    );

    // globalMaxPlayers[socket.id] = details.players;
    // console.log(details.players);
    await setMax(socket.id, details.players);

    socket.emit("created", socket.id);
  });

  socket.on("getData", async (id) => {
    console.log("THE ID IS: " + id);
    // API CALL
    const gameQuestions = await getQuestions(id);
    // console.log(gameQuestions);
    socket.emit("receiveData", gameQuestions);
    socket.to(id).emit("sendQuestions", gameQuestions);
  });

  socket.on("result", async (data) => {
    // SAVE THE RESULT TO DB
    //console.log(`${data.username} has scored ${data.points} points`);
    await saveScore(data.points, data.username, data.room);

    // FETCH ALL SCORES FOR THIS LOBBY
    const roomScores = await getScore(data.room);
    // GIVE BACK ALL THE SCORES

    io.to(data.room).emit("updatedResults", roomScores);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the game");
  });
});

instrument(io, { auth: false });

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
