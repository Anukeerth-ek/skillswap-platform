import express from "express";
import {
     acceptSession,
     deleteSession,
     getMySessions,
     requestSession,
     saveRoadmap,
     getRoadmap,
} from "../controllers/meetSessionController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.patch("/approve/:id", authenticateUser, acceptSession);

router.delete("/delete/:id", authenticateUser, deleteSession);

router.post("/request", authenticateUser, requestSession);

router.get("/my-sessions", authenticateUser, getMySessions);

router.post("/:id/roadmap", authenticateUser, saveRoadmap);

router.get("/:id/roadmap", authenticateUser, getRoadmap);

export default router;
