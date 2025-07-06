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
               data: { status: status as any }, // Cast to 'any' or 'SessionStatus' if imported
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
     console.log("we are here in backend boyy");
     console.log("Decoded user ID:", req.userId);

     const userId = req.user?.id;

     if (!userId) {
          res.status(401).json({ message: "Unauthorized" });
          return;
     }

     const parsed = profileSchema.safeParse(req.body);
     if (!parsed.success) {
          res.status(400).json({
               message: "Invalid profile data",
               errors: parsed.error.format(),
          });
          return;
     }

     const { name, bio, avatarUrl, timeZone, skillsOffered, skillsNeeded } = parsed.data;

     try {
          const existingUser = await prisma.user.findUnique({ where: { id: userId } });

          if (!existingUser) {
               res.status(404).json({ message: "User not found" });
               return 
          }

          // Disconnect existing skills to avoid duplication
          await prisma.user.update({
               where: { id: userId },
               data: {
                    skillsOffered: { set: [] },
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
                    // skillsNeeded property removed or adjust according to your schema
               },
               include: {
                    skillsOffered: true,
               },
          });

          console.log("we got it ", user)

          res.status(200).json({ user });
          return;
     } catch (error) {
          console.error("Error creating/updating profile:", error);
          res.status(500).json({ message: "Server error" });
          return;
     }
};

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skillsOffered: true,
        skillsWanted: true,
      },
    });

    if (!user) {
         res.status(404).json({ message: "User not found" });
      return 
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
