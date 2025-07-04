import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { Prisma } from "../../generated/prisma";

const statusSchema = z.object({
     status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});

interface AuthenticatedRequest extends Request {
     user?: { id: string };
}

export const updateSessionStatus = async (req: AuthenticatedRequest, res: Response) => {
     const mentorId = req.user?.id;
     const { id } = req.params;

     const parsed = statusSchema.safeParse(req.body);
     if (!parsed.success) {
          res.status(400).json({ message: "Invalid status", errors: parsed.error.format() });
          return;
     }

     const { status } = parsed.data;

     const session = await prisma.session.findFirst({
          where: { id, mentorId },
     });

     if (!session) {
          res.status(404).json({ message: "Session not found or unauthorized" });
          return;
     }

     const updatedSession = await prisma.session.update({
          where: { id },
          data: {
               status: { set: status as any },
          },
     });

     res.status(200).json({ session: updatedSession });
};
