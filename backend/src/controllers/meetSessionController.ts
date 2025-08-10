import prisma from "../prismaClient";
import { createMeetEvent } from "../lib/googleCalendar";

export const acceptSession = async (req: any, res: any) => {
     const sessionId = req.params.id;
     const { status } = req.body;
     const allowedStatuses = ["CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"];

     if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
     }

     try {
          const session = await prisma.session.findUnique({ where: { id: sessionId } });
          console.log("session", session)
          if (!session) return res.status(404).json({ message: "Session not found" });

          let meetLink: any = session.meetLink;
          console.log("helo", meetLink);
          if (status === "CONFIRMED" && !meetLink) {
               try {
                    const startTime = session.scheduledAt.toISOString();
                    const endTime = new Date(session.scheduledAt.getTime() + 60 * 60 * 1000).toISOString();

                    console.log("mentor", session.mentorId);
                    const mentorTokens = await prisma.googleToken.findUnique({
                         where: { userId: session.mentorId },
                    });
                    if (!mentorTokens) {
                         return res.status(400).json({ message: "Mentor Google tokens not found" });
                    }

                    meetLink = await createMeetEvent({
                         summary: `SkillSwap: ${session.skillId}`,
                         description: "Mentorship Session",
                         startTime,
                         endTime,
                         tokens: {
                              accessToken: mentorTokens.accessToken,
                              refreshToken: mentorTokens.refreshToken,
                              scope: mentorTokens.scope,
                              tokenType: mentorTokens.tokenType,
                              expiryDate: mentorTokens.expiryDate,
                         },
                    });
               } catch (error) {
                    console.error("Failed to create Google Meet event:", error);
                    return res.status(500).json({ message: "Failed to create meeting link" });
               }
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

export const deleteSession = async (req: any, res: any) => {
     const sessionId = req.params.id;
     //   const userId = req.userId; // from your auth middleware

     try {
          // Optionally verify user owns this session or is allowed to delete
          const session = await prisma.session.findUnique({ where: { id: sessionId } });
          if (!session) return res.status(404).json({ message: "Session not found" });

          //     if (session.mentorId === userId && session.learnerId !== userId) {
          //       return res.status(403).json({ message: "Not authorized to delete this session" });
          //     }

          await prisma.session.delete({ where: { id: sessionId } });

          res.json({ message: "Session deleted successfully" });
     } catch (error) {
          console.error("Error deleting session", error);
          res.status(500).json({ message: "Internal server error" });
     }
};

export const requestSession = async (req: any, res: any) => {
     try {
          const { startTime, mentorId, selectedSkillNames } = req.body;

          console.log("anukeerth", req.body);

          if (!mentorId || !selectedSkillNames || !startTime) {
               return res.status(400).json({ message: "mentorId, skillId and startTime are required" });
          }
          // 1️⃣ Find the skill by name
          const skill = await prisma.skill.findUnique({
               where: { name: selectedSkillNames },
          });
          if (!skill) {
               return res.status(404).json({ message: `Skill '${selectedSkillNames}' not found` });
          }
          const learnerId = req.userId; // Comes from verifyToken middleware

          const session = await prisma.session.create({
               data: {
                    mentor: { connect: { id: mentorId } },
                    learner: { connect: { id: learnerId } },
                    skill: { connect: { id: skill.id } },
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
