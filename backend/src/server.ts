import express = require("express");
import dotenv = require("dotenv");
import skillRoutes from "./routes/skillRoutes";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes"
import authRoutes from "./routes/authRoutes"
import learnerRoutes from "./routes/learnerRoutes"
import mentorRoutes from "./routes/mentorRoutes"

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/bookSession", sessionRoutes);
app.use("/api/userProfile", userRoutes);
app.use("/api/learnersBooking", learnerRoutes)
app.use("/api/mentorBooking", mentorRoutes)

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}`);
});
