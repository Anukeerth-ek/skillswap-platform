import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors"); 
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket";
import skillRoutes from "./routes/skillRoutes";
import userRoutes from "./routes/userRoutes";
import bookSessionRoutes from "./routes/bookSessionRoutes";
import authRoutes from "./routes/authRoutes";
import learnerRoutes from "./routes/learnerRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import profileRoutes from "./routes/profile.routes"
import connectionRoutes from "./routes/connectionRoutes"
import followRoutes from "./routes/followRoutes"
import meetSessionRoutes from './routes/meetSessionRoutes'

dotenv.config();

const app = express();

app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/bookSession", bookSessionRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/learnersBooking", learnerRoutes);
app.use("/api/mentorBooking", mentorRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/connections", connectionRoutes);
app.use("/api/follow", followRoutes);

app.use("/api", connectionRoutes);

app.use("/api/sessions", meetSessionRoutes)

const server = http.createServer(app);
initSocket(server);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // adjust to your frontend URL
    credentials: true,
  },
});

const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    onlineUsers.set(userId, socket.id);

  }

  socket.on("disconnect", () => {
    if (userId) onlineUsers.delete(userId);
    console.log('userid')
  });
});

// ✅ Export Socket.IO and user map so you can use them in controllers
export { io, onlineUsers };
const PORT = process.env.PORT || 4500;

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
