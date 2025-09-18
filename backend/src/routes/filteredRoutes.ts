import { Router } from "express";
import { getFilteredProfile } from "../controllers/filteredProfiles";
import { authenticateUser } from "../middleware/authMiddleware";

const profileRouter = Router();

profileRouter.get("/filter", authenticateUser, getFilteredProfile);

export default profileRouter;
