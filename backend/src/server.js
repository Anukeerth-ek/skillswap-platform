"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const skillRoutes_1 = __importDefault(require("./routes/skillRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookSessionRoutes_1 = __importDefault(require("./routes/bookSessionRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const learnerRoutes_1 = __importDefault(require("./routes/learnerRoutes"));
const mentorRoutes_1 = __importDefault(require("./routes/mentorRoutes"));
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/skills", skillRoutes_1.default);
app.use("/api/bookSession", bookSessionRoutes_1.default);
app.use("/api/userProfile", userRoutes_1.default);
app.use("/api/learnersBooking", learnerRoutes_1.default);
app.use("/api/mentorBooking", mentorRoutes_1.default);
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
