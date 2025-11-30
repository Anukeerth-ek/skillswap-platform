import express from "express";
import { aiQueryToFilters } from "../controllers/ai-search.controller";

const router = express.Router();

router.post("/ai-query", aiQueryToFilters);

export default router;
