import express from 'express';
import { acceptSession, requestSession } from '../controllers/meetSessionController';

const router = express.Router();

router.put("/sessions/:id/accept", acceptSession);

router.post("/request",  requestSession); 

export default router;
