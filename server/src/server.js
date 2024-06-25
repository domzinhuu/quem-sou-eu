import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { Room } from "./models/room.js";
import { Player } from "./models/player.js";
import { game } from "./data/game.js";
import { gameUpdate } from "./helpers/ws.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/ws/",
  cors: {
    origin: "*",
  },
});

app.post("/api/createRoom", (req, res) => {
  const { data, user } = req.body;
  const room = new Room({ ...data, hostId: user.id });
  game.addNewMatch(room);

  return res.json({ ok: true, roomId: room.id });
});

app.post("/api/enterRoom", (req, res) => {
  const body = req.body;
  const room = game.rooms.find((r) => r.id === body.room);

  if (!room) {
    return res.status(404).json({ error: "not found" });
  }

  if (room.isSecure && room.password !== body.password) {
    return res.status(401).json({ error: "senha inválida" });
  }

  if (room.capacity === game.context[body.room].players.length) {
    return res
      .status(403)
      .json({ error: "Capacidade maxima da sala atingida" });
  }

  const gameStatus = game.context[room.id].gameStatus;

  if (gameStatus === "running") {
    return res
      .status(403)
      .json({ error: "A partida já começou, aguarde a próxima rodada." });
  }
  return res.status(200).json({ ok: true });
});

app.post("/api/startGame", (req, res) => {
  const body = req.body;
  const host = game.getRoomPlayer(body.roomId, body.playerId);

  if (!host) {
    return res
      .status(401)
      .json({ error: "Apenas o host da sala pode iniciar o game" });
  }

  game.updateGameStatus("running", body.roomId);
  game.nextPlayer(body.roomId);
  game.defineWhoAmI(body.roomId);

  return res.status(200).json({ ok: true });
});

app.post("/api/nextTurn", (req, res) => {
  const body = req.body;
  game.nextPlayer(body.roomId);
  return res.status(200).json({ ok: true });
});

app.post("/api/removePlayerFromMatch", (req, res) => {
  const body = req.body;
  const playerLeft = game.removePlayerFromMatch(body.roomId, body.playerId);

  return res.json({ playerLeft });
});

app.get("/api/getGameSession", (req, res) => {
  const { userId, room } = req.query;
  const gameRoom = game.listRooms.find((r) => r.name === room);

  if (!gameRoom) {
    return res.status(404).json({ error: "Room not found" });
  }
  const context = game.context[gameRoom.id];

  if (!context) {
    return res.status(404).json({ error: "No match found!" });
  }

  const player = context.players.find((p) => p.id === userId);

  if (!player) {
    return res.status(404).json({ error: "Voce nao esta jogando nesta sala!" });
  }

  return res.json(context);
});

app.get("/api/roomList", (req, res) => {
  return res.json(game.listRooms || []);
});

io.on("connection", (socket) => {
  socket.on("refresh_user", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("player_joined", ({ roomId, user }) => {
    socket.join(roomId);
    const player = new Player(user);
    game.newPlayerJoined(roomId, player);

    gameUpdate(io, roomId, game.context[roomId]);
    socket.to(roomId).emit("new_player_joined", {
      newPlayerName: player.name,
    });
  });

  socket.on("new_room_created", () => {
    io.emit("list_room_updated", { list: game.listRooms });
  });

  socket.on("game_changed", (roomId) => {
    gameUpdate(io, roomId, game.context[roomId]);
  });

  socket.on("emit_who_am_i", async (roomId) => {
    const currentPlayer = game.context[roomId].currentPlayer;
    if (game.context[roomId]) {
      const whoAmI = game.contextWhoAmIList[roomId][currentPlayer.id];
      socket.to(roomId).emit("show_whoAmI", whoAmI);
      socket.to(roomId).emit("listen_current_question", "");
    }
  });

  socket.on("emit_current_question", ({ roomId, playerId, question }) => {
    game.setPlayerQuestion(roomId, playerId, question);
    gameUpdate(io, roomId, game.context[roomId]);
  });

  socket.on("emit_vote", ({ roomId, playerId, vote }) => {
    game.giveCurrentPlayerVote(roomId, playerId, vote);
    gameUpdate(io, roomId, game.context[roomId]);

    const player = game.getRoomPlayer(roomId, playerId);

    socket.to(roomId).emit("received_vote", { playerName: player.name, vote });
  });

  socket.on("emit_giveAtry", ({ roomId, whoAmI }) => {
    const winner = game.validateGuess(roomId, whoAmI);

    if (!winner) {
      const gameOver = game.checkIfGameOver(roomId);

      if (!gameOver) {
        game.nextPlayer(roomId);
      }
    } else {
      game.endMatch(roomId);
    }

    gameUpdate(io, roomId, game.context[roomId]);
  });

  socket.on("emit_close_room", ({ roomId, playerName }) => {
    socket.leave(roomId);
    io.to(roomId).emit("player_leave_room", { playerName });
    if (game.context[roomId].players.length === 0) {
      const roomSockets = io.sockets.adapter.rooms[roomId]?.sockets || {};

      for (const socketId in roomSockets) {
        const sk = io.sockets.sockets[socketId];
        if (sk) {
          sk.leave(roomId);
        }
      }

      delete game.context[roomId];
      game.rooms = game.rooms.filter((room) => room.id !== roomId);
      game.listRooms = game.listRooms.filter((room) => room.id !== roomId);
      delete game.contextWhoAmIList[roomId];
      io.emit("list_room_updated", { list: game.listRooms });
    }
  });
});

httpServer.listen(3333, () =>
  console.log("server is running at http://localhost:3333")
);
