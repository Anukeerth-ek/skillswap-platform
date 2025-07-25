import express from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  getIncomingRequests,
  getAcceptedConnections,
  getUserConnections,
} from "../controllers/connectionController";

const router = express.Router();

router.post("/request", sendConnectionRequest);
router.post("/accept", acceptConnectionRequest);
router.post("/decline", declineConnectionRequest);

router.get("/requests/incoming/:userId", getIncomingRequests);
router.get("/accepted/:userId", getAcceptedConnections);

router.get("/connections/:userId", getUserConnections);
export default router;
