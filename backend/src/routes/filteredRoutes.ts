import { Router } from "express";
import { getAllProfiles } from "../controllers/filteredProfiles";
import { authenticateUser } from "../middleware/authMiddleware";

export const profileRouter = Router();

// GET /api/profile/all (protected route)
profileRouter.get("/all", authenticateUser, getAllProfiles);
