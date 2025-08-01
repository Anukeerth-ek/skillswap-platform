import express from "express";
import { getUserProfile, updateSessionStatus, createUserProfile} from "../controllers/userController";
import { authenticateUser } from "../middleware/authMiddleware";
import { upload } from "../middleware/upload";
import { getAllProfiles, updateUserProfile } from "../controllers/profileController";
const router = express.Router();

router.get("/me", authenticateUser, getUserProfile);

// ✅ FIXED: apply `authenticateUser` here too
router.post("/", authenticateUser, upload.single("avatar"), createUserProfile);

router.put("/update", authenticateUser, upload.single("avatar"), updateUserProfile);
// router.post("/", authenticateUser, upload.single("avatar"), updateUserProfile);

router.put("/:id", authenticateUser, updateSessionStatus as unknown as express.RequestHandler);

router.get("/all",getAllProfiles);

export default router;
