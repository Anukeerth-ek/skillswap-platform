// src/routes/followRoutes.ts

import express from "express";
import { followUser } from "../controllers/followController";

const router = express.Router();

router.post("/", followUser);

export default router;
