import express from 'express';
import {acceptSession,  deleteSession, getMySessions, requestSession } from '../controllers/meetSessionController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.patch("/approve/:id", authenticateUser, acceptSession);

router.delete("/delete/:id", authenticateUser, deleteSession);

router.post("/request", authenticateUser, requestSession); 

router.get("/my-sessions", authenticateUser, getMySessions);

export default router;
