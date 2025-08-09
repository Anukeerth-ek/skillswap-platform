import prisma from "../prismaClient";
import { createMeetEvent } from "../lib/googleCalendar";

export const acceptSession = async (req: any, res: any) => {
     const sessionId = req.params.id;
     const { status } = req.body;

     try {
          const session = await prisma.session.findUnique({ where: { id: sessionId } });
          if (!session) return res.status(404).json({ message: "Session not found" });

          let meetLink: any = session.meetLink;

          if (status === "CONFIRMED" && !meetLink) {
               const startTime = session.scheduledAt.toISOString();
               const endTime = new Date(session.scheduledAt.getTime() + 60 * 60 * 1000).toISOString();

               meetLink = await createMeetEvent({
                    summary: `SkillSwap: ${session.skillId}`,
                    description: "Mentorship Session",
                    startTime,
                    endTime,
               });
          }

          const updated = await prisma.session.update({
               where: { id: sessionId },
               data: {
                    status,
                    meetLink,
               },
          });

          res.json({ message: `Session ${status.toLowerCase()}`, session: updated });
     } catch (error) {
          console.error("Error updating session", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

export const requestSession = async (req: any, res: any) => {
     try {
          const { startTime, mentorId, skill } = req.body;

          console.log("anukeerth", skill);

          if (!mentorId || !skill || !startTime) {
               return res.status(400).json({ message: "mentorId, skillId and startTime are required" });
          }

          const learnerId = req.userId; // Comes from verifyToken middleware

          const session = await prisma.session.create({
               data: {
                    mentor: { connect: { id: mentorId } },
                    learner: { connect: { id: learnerId } },
                    skill: { connect: { id: skill } },
                    scheduledAt: new Date(startTime),
                    status: "PENDING",
               },
          });

          res.status(201).json({ message: "Session request created", session });
     } catch (error) {
          console.error("Error creating session request", error);
          res.status(500).json({ message: "Internal server error" });
     }
};


export const getMySessions = async (req: any, res: any) => {
     try {
          const userId = req.userId;

          const sessions = await prisma.session.findMany({
               where: {
                    OR: [{ mentorId: userId }, { learnerId: userId }],
               },
               include: {
                    mentor: { select: { name: true } },
                    learner: { select: { name: true } },
                    skill: { select: { name: true } }, 
               },
               orderBy: { scheduledAt: "desc" },
          });

          console.log("sessionanukeert", sessions);
          res.json({ sessions });
     } catch (error) {
          console.error("Error fetching sessions:", error);
          res.status(500).json({ message: "Server error" });
     }
};
