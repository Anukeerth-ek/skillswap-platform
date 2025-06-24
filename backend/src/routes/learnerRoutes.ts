
import express from 'express';
import { getLearnerBookings } from '../controllers/getLearnersBooking';
import { authenticateUser } from '../middleware/authMiddleware'; // Make sure this sets req.user

const router = express.Router();

router.get('/learner', authenticateUser, getLearnerBookings);

export default router;
