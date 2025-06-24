import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getMentorSessions = async (req: Request, res: Response) => {
     try {
          const mentorId = req.user?.id;

          if (!mentorId) {
               res.status(401).json({ message: "Unauthorized" });
               return;
          }

          const sessions = await prisma.session.findMany({
               where: { mentorId },
               include: {
                    learner: {
                         select: {
                              id: true,
                              name: true,
                              avatarUrl: true,
                              bio: true,
                         },
                    },
               },
          });

          res.status(200).json(sessions);
          return;
     } catch (error) {
          console.error("Error fetching mentor's sessions:", error);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};
