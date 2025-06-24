import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { updateSessionStatus } from "../controllers/sessionUpdateStatus";

const router = express.Router();

router.patch(
  "/sessions/:id/status",
  authenticateUser,
  asyncHandler(updateSessionStatus)
);

export default router;
