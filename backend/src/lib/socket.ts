import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // adjust this if frontend URL differs
    credentials: true,
  },
});

// Track connected users
const onlineUsers = new Map<string, string>(); // userId -> socket.id

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} connected: ${socket.id}`);
  }

  socket.on("disconnect", () => {
    if (userId) onlineUsers.delete(userId);
    console.log(`${userId} disconnected`);
  });
});

export { io, onlineUsers };
export default server;
