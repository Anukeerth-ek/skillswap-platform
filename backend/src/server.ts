import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors"); 

import skillRoutes from "./routes/skillRoutes";
import userRoutes from "./routes/userRoutes";
import bookSessionRoutes from "./routes/bookSessionRoutes";
import authRoutes from "./routes/authRoutes";
import learnerRoutes from "./routes/learnerRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import profileRoutes from "./routes/profile.routes"

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

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
