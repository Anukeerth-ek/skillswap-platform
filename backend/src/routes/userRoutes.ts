import express from "express";
import { getUserProfile, updateSessionStatus, createUserProfile} from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/me", authenticateUser, getUserProfile);

// ✅ FIXED: apply `authenticateUser` here too
router.post("/", authenticateUser, createUserProfile);

router.put("/:id", authenticateUser, updateSessionStatus as unknown as express.RequestHandler);

export default router;
