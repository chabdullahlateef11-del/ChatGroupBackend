import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:[
      "http://localhost:5173",
      "https://chat-group-real.netlify.app/" 
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>HELLO from Realtime Socket Chat Server</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // JOIN A ROOM
  socket.on("join", ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit("system", { text: `${username} joined the group.` });
  });

  // LEAVE A ROOM
  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  // BROADCAST TO ROOM
  socket.on("send", (message) => {
    console.log(message);
    socket.to(message.room).emit("message", message);
  });

  // TYPING INDICATOR
  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing", { username });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// GALTI: app.listen(5050, ...) socket.io se juda hua server use NAHI karta.
// Socket.io wale "server" ko hi listen karwana zaroori hai:
server.listen(5050, () => {
  console.log("Server is running on 5050");
});