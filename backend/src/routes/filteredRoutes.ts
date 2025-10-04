import { Router } from "express";
import { getFilteredProfile } from "../controllers/filteredProfiles";
import { optionalAuth } from "../middleware/optionalAuthMiddleware";
// import { authenticateUser } from "../middleware/authMiddleware";

const profileRouter = Router();

profileRouter.get("/filter", optionalAuth, getFilteredProfile);

export default profileRouter;
