import express from "express";
import { getUserProfile, updateSessionStatus} from "../controllers/userController";
const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", updateSessionStatus);

export default router;
