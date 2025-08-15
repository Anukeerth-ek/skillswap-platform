import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.get("/status", authenticateUser, async (req:any, res:any) => {
  try {
    const tokenRow = await prisma.googleToken.findUnique({
      where: { userId: req.userId! },
      select: { userId: true },
    });
    return res.json({ hasTokens: !!tokenRow });
  } catch (e) {
    console.error("google-token/status error:", e);
    return res.status(500).json({ hasTokens: false });
  }
});

export default router;

