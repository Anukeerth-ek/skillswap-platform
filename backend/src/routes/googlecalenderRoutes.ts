import express from "express";
import { startGoogleOAuth, handleGoogleOAuthCallback } from "../controllers/googlemeetcontroller";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/auth", authenticateUser, startGoogleOAuth);
router.get("/callback", authenticateUser, handleGoogleOAuthCallback);

export default router;


