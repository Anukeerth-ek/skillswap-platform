import express from 'express';
import { acceptSession } from '../controllers/meetSessionController';

const router = express.Router();

router.put("/sessions/:id/accept", acceptSession);

export default router;
