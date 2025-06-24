import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const bookSessionSchema = z.object({
     mentorId: z.string().uuid({ message: "Invalid mentor ID" }),
     learnerId: z.string().uuid({ message: "Invalid learner ID" }),
     skillId: z.string().uuid({ message: "Invalid skill ID" }),
     scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format for scheduledAt",
     }),
});

export const bookSession = async (req: Request, res: Response) => {
     const parsed = bookSessionSchema.safeParse(req.body);

     if (!parsed.success) {
          res.status(400).json({
               message: "Validation error",
               errors: parsed.error.format(),
          });
          return;
     }

     const { mentorId, learnerId, skillId, scheduledAt } = parsed.data;

     try {
          const session = await prisma.session.create({
               data: {
                    mentorId,
                    learnerId,
                    skillId,
                    scheduledAt: new Date(scheduledAt),
               },
          });

          res.status(200).json(session);
          return;
     } catch (error: any) {
          console.error("Error creating session:", error);
          res.status(500).json({ message: "Failed to create session" });
          return;
     }
};
