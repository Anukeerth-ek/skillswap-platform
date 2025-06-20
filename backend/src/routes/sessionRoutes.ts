import express from 'express'
import { bookSession  } from "../controllers/sessionController";
const router = express.Router()

router.post("/", bookSession );

export default router
