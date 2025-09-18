import { Router } from "express";
import { getAllProfiles } from "../controllers/filteredProfiles";
import { authenticateUser } from "../middleware/authMiddleware";

const profileRouter = Router();

profileRouter.get("/filter", authenticateUser, getAllProfiles);

export default profileRouter;
