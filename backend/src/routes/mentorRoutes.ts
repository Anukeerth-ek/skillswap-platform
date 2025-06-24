import express from "express";
import { getMentorSessions } from "../controllers/getMentorSession";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/mentor", authenticateUser, getMentorSessions);

export default router;
