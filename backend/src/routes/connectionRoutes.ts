import express from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
} from "../controllers/connectionController";

const router = express.Router();

router.post("/request", sendConnectionRequest);
router.post("/accept", acceptConnectionRequest);
router.post("/decline", declineConnectionRequest);

export default router;
