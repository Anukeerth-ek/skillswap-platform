import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";

const statusSchema = z.object({
     status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"]),
});

const profileSchema = z.object({
     name: z.string().min(2),
     bio: z.string().optional(),
     avatarUrl: z.string().url().optional(),
     timeZone: z.string().optional(),
     skillsOffered: z.array(z.string()).optional(), // Skill IDs
     skillsNeeded: z.array(z.string()).optional(), // Skill IDs
});

interface AuthenticatedRequest extends Request {
     user?: { id: string };
}

export const updateSessionStatus = async (req: AuthenticatedRequest, res: Response) => {
     const mentorId = req.user?.id;
     const { id } = req.params;

     const parsed = statusSchema.safeParse(req.body);
     if (!parsed.success) {
          res.status(400).json({
               message: "Invalid status",
               errors: parsed.error.format(),
          });
          return;
     }

     const { status } = parsed.data;

     try {
          const session = await prisma.session.findFirst({
               where: { id, mentorId },
          });

          if (!session) {
               res.status(404).json({
                    message: "Session not found or unauthorized",
               });
               return;
          }

          const updatedSession = await prisma.session.update({
               where: { id },
               data: { status },
          });

          res.status(200).json({ session: updatedSession });
          return;
     } catch (error) {
          console.error("Error updating session:", error);
          res.status(500).json({ message: "Server error" });
          return;
     }
};

export const createUserProfile = async (req: AuthenticatedRequest, res: Response) => {
     const userId = req.user?.id;

     if (!userId) {
          return res.status(401).json({ message: "Unauthorized" });
     }

     const parsed = profileSchema.safeParse(req.body);
     if (!parsed.success) {
          return res.status(400).json({
               message: "Invalid profile data",
               errors: parsed.error.format(),
          });
     }

     const { name, bio, avatarUrl, timeZone, skillsOffered, skillsNeeded } = parsed.data;

     try {
          // Disconnect existing skills to avoid duplication
          await prisma.user.update({
               where: { id: userId },
               data: {
                    skillsOffered: { set: [] },
                    skillsNeeded: { set: [] },
               },
          });

          // Update with new data
          const user = await prisma.user.update({
               where: { id: userId },
               data: {
                    name,
                    bio,
                    avatarUrl,
                    timeZone,
                    skillsOffered: {
                         connect: skillsOffered?.map((id) => ({ id })) || [],
                    },
                    skillsNeeded: {
                         connect: skillsNeeded?.map((id) => ({ id })) || [],
                    },
               },
               include: {
                    skillsOffered: true,
                    skillsNeeded: true,
               },
          });

          res.status(200).json({ user });
          return;
     } catch (error) {
          console.error("Error creating/updating profile:", error);
          return res.status(500).json({ message: "Server error" });
     }
};

export const getUserProfile = async (req: Request, res: Response) => {
     const { id } = req.params;

     try {
          const user = await prisma.user.findUnique({
               where: { id },
               include: {
                    skillsOffered: true,
                    skillsNeeded: true,
               },
          });

          if (!user) {
               res.status(404).json({ message: "User not found" });
               return;
          }

          res.status(200).json({ user });
          return;
     } catch (error) {
          console.error("Error fetching user profile:", error);
          res.status(500).json({ message: "Server error" });
          return;
     }
};
