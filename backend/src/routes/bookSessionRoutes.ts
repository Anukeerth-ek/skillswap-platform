import express from 'express'
import { bookSession  } from "../controllers/bookSessionController";
const router = express.Router()

router.post("/", bookSession );

export default router
