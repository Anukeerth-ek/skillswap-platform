import express from 'express';
import { acceptSession, getMySessions, requestSession } from '../controllers/meetSessionController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.put("/sessions/:id/accept", acceptSession);

router.post("/request", authenticateUser, requestSession); 

router.get("/my-sessions", authenticateUser, getMySessions);

export default router;
