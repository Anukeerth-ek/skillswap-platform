import { Express } from "express"
import { bookSession  } from "../controllers/sessionController";
const router = express.router()

router.post("/", bookSession );

export default router
