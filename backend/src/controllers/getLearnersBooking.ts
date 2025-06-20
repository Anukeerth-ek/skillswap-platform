import { Request, Response } from "express";
import prisma from "../lib/prisma";

declare global {
     namespace Express {
          interface User {
               id: string;
               // add other user properties if needed
          }
          interface Request {
               user?: User;
          }
     }
}

export const getLearnerBookings = async (req: Request, res: Response) => {
     try {
          const learnerId = req?.user?.id;

          if (!learnerId) {
               res.status(401).json({ message: "Unauthorized" });
               return;
          }

          const sessions = await prisma.session.findMany({
               where: { learnerId },
               include: {
                    mentor: {
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
          console.error("Error fetching learner's bookings:", error);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};
