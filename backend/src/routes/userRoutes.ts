import express from "express";
import { getUserProfile, updateSessionStatus, createUserProfile} from "../controllers/userController";
const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", updateSessionStatus);
router.post("/profile", createUserProfile);

export default router;
