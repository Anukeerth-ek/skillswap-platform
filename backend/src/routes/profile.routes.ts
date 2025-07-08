import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { updateUserProfile } from "../controllers/profileController";

const router = Router();

router.post("/", authenticateUser, updateUserProfile);

export default router;
