// src/socket.ts
import { Server } from "socket.io";

let io: Server;
const onlineUsers = new Map<string, string>();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (userId) {
      onlineUsers.set(userId, socket.id);

    }

    socket.on("disconnect", () => {
      if (userId) onlineUsers.delete(userId);
      console.log(`disconnected`);
    });
  });

  return io;
};

export const getIO = () => io;
export const getOnlineUsers = () => onlineUsers;
