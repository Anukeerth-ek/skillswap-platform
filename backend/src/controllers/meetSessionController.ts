import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createMeetEvent } from "../lib/googleCalendar";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { SessionStatus } from "@prisma/client";
export const requestSession = async (req: AuthenticatedRequest, res: Response) => {
     try {
          const { startTime, mentorId, selectedSkillNames } = req.body;
          if (!mentorId || !selectedSkillNames || !startTime) {
               res.status(400).json({ message: "mentorId, selectedSkillNames and startTime are required" });
               return;
          }

          const skill = await prisma.skill.findUnique({ where: { name: selectedSkillNames } });
          if (!skill) {
               res.status(404).json({ message: `Skill '${selectedSkillNames}' not found` });
               return;
          }

          const learnerId = req.userId!;
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
          return;
     } catch (e) {
          console.error("requestSession error:", e);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};

export const getMySessions = async (req: AuthenticatedRequest, res: Response) => {
     try {
          const userId = req.userId!;
          const sessions = await prisma.session.findMany({
               where: { OR: [{ mentorId: userId }, { learnerId: userId }] },
               include: {
                    mentor: { select: { name: true, email: true } },
                    learner: { select: { name: true, email: true } },
                    skill: { select: { name: true } },
               },
               orderBy: { scheduledAt: "desc" },
          });

          res.json({ sessions });
          return;
     } catch (e) {
          console.error("getMySessions error:", e);
          res.status(500).json({ message: "Server error" });
          return;
     }
};

export const acceptSession = async (req: AuthenticatedRequest, res: Response) => {
     const sessionId = String(req.params.id);
     const { status } = req.body as { status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED" };

     const allowed: SessionStatus[] = [
          SessionStatus.CONFIRMED,
          SessionStatus.REJECTED,
          SessionStatus.CANCELLED,
          SessionStatus.COMPLETED,
     ];

     if (!allowed.includes(status as SessionStatus)) {
          res.status(400).json({ message: "Invalid status" });
          return;
     }

     try {
          const session = await prisma.session.findUnique({
               where: { id: sessionId },
               include: {
                    mentor: { select: { id: true, email: true } },
                    learner: { select: { email: true } },
                    skill: { select: { name: true } },
               },
          });

          if (!session) {
               res.status(404).json({ message: "Session not found" });
               return;
          }

          // ✅ Only the mentor can approve/confirm this session
          if (status === "CONFIRMED" && req.userId !== session.mentorId) {
               res.status(403).json({ message: "Only the mentor can approve this session" });
               return;
          }

          let meetLink = session.meetLink || null;

          if (status === "CONFIRMED" && !meetLink) {
               // get mentor’s google tokens (the approving user)
               const mentorTokens = await prisma.googleToken.findUnique({
                    where: { userId: session.mentorId },
               });

               if (!mentorTokens?.accessToken) {
                    res.status(400).json({ message: "Mentor Google tokens not found" });
                    return;
               }

               const startISO = session.scheduledAt.toISOString();
               const endISO = new Date(session.scheduledAt.getTime() + 60 * 60 * 1000).toISOString();

               const timeZone = "UTC"; // or mentor's actual timezone if stored

               const link = await createMeetEvent({
                    summary: `SkillSwap: ${session.skill.name}`,
                    description: "Mentorship Session",
                    startTime: startISO,
                    endTime: endISO,
                    timeZone,
                    attendees: [
                         ...(session.mentor.email ? [{ email: session.mentor.email }] : []),
                         ...(session.learner.email ? [{ email: session.learner.email }] : []),
                    ],
                    tokens: {
                         accessToken: mentorTokens.accessToken,
                         refreshToken: mentorTokens.refreshToken || undefined,
                    },
               });

               meetLink = link;
          }

          const updated = await prisma.session.update({
               where: { id: sessionId },
               data: {
                    status: status as SessionStatus, // ✅ cast to Prisma enum
                    meetLink: meetLink ?? undefined,
               },
          });

          res.json({ message: `Session ${status.toLowerCase()}`, session: updated });
     } catch (e) {
          console.error("acceptSession error:", e);
          res.status(500).json({ message: "Internal server error" });
     }
};

export const deleteSession = async (req: AuthenticatedRequest, res: Response) => {
     try {
          const sessionId = String(req.params.id);
          const session = await prisma.session.findUnique({ where: { id: sessionId } });
          if (!session) {
               res.status(404).json({ message: "Session not found" });
               return;
          }

          await prisma.session.delete({ where: { id: sessionId } });
          res.json({ message: "Session deleted successfully" });
          return;
     } catch (e) {
          console.error("deleteSession error:", e);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};
