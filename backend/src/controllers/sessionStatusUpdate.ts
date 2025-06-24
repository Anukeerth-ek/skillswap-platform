import express from "express";
import prisma from "../lib/prisma";
import { authenticateUser } from "../middleware/authMiddleware";
import { Request, Response } from "express";
import { z } from "zod";

const router = express.Router();

const statusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});

router.patch("/sessions/:id/status", authenticateUser, async (req:Request, res:Response) => {
  const mentorId = req.user?.id; 
  const { id } = req.params;

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid status", errors: parsed.error.format() });
  }

  const { status } = parsed.data;

  try {

    const session = await prisma.session.findFirst({
      where: {
        id,
        mentorId,
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found or unauthorized" });
    }

    const updatedSession = await prisma.session.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error("Error updating session status:", error);
    return res.status(500).json({ message: "Failed to update session status" });
  }
});

export default router;
