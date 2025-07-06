import express from "express";
import { getUserProfile, updateSessionStatus, createUserProfile} from "../controllers/userController";
const router = express.Router();

router.get("/:id", getUserProfile);

router.put("/:id", updateSessionStatus as unknown as express.RequestHandler);

router.post("/", createUserProfile as unknown as express.RequestHandler);

export default router;
