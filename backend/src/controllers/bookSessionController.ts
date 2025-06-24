import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const bookSession  = async (req: Request, res: Response) => {
     try {
          const { mentorId, learnerId, skillId, scheduledAt } = req.body;

          if (!mentorId || !learnerId || !skillId || !scheduledAt) {
               res.status(400).json({ message: "All fields are required" });
               return
          }

          const session = prisma.session.create({
               data: {
                    mentorId,
                    learnerId,
                    skillId,
                    scheduledAt: new Date(scheduledAt),
               },
          });

          res.status(200).json(session);
          return
     } catch (error: any) {
          Error(error);
          console.log("There is a problem while fetching...", error);
     }
};
