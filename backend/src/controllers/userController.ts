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
  skillsOffered: z.array(z.string()).optional(),
  skillsWanted: z.array(z.string()).optional(),
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

  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const {
      name,
      bio,
      timeZone,
      professionTitle,
      organization,
      experienceYears,
      experienceDescription,
      currentStatus,
      linkedin,
      github,
      twitter,
      website,
    } = req.body;

    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const skillsOffered = req.body["skillsOffered[]"]
      ? Array.isArray(req.body["skillsOffered[]"])
        ? req.body["skillsOffered[]"]
        : [req.body["skillsOffered[]"]]
      : [];

    const skillsWanted = req.body["skillsWanted[]"]
      ? Array.isArray(req.body["skillsWanted[]"])
        ? req.body["skillsWanted[]"]
        : [req.body["skillsWanted[]"]]
      : [];

    // Disconnect existing skills
    await prisma.user.update({
      where: { id: userId },
      data: {
        skillsOffered: { set: [] },
        skillsWanted: { set: [] },
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        avatarUrl,
        timeZone,
        skillsOffered: {
          connectOrCreate: skillsOffered.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
        skillsWanted: {
          connectOrCreate: skillsWanted.map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
        professionDetails: {
          upsert: {
            update: { title: professionTitle },
            create: { title: professionTitle },
          },
        },
        currentOrganization: {
          upsert: {
            update: { organization },
            create: { organization },
          },
        },
        experienceSummary: {
          upsert: {
            update: {
              years: Number(experienceYears),
              description: experienceDescription,
            },
            create: {
              years: Number(experienceYears),
              description: experienceDescription,
            },
          },
        },
        currentStatus: {
          upsert: {
            update: { status: currentStatus },
            create: { status: currentStatus },
          },
        },
        socialLinks: {
          upsert: {
            update: {
              linkedin,
              github,
              twitter,
              website,
            },
            create: {
              linkedin,
              github,
              twitter,
              website,
            },
          },
        },
      },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        professionDetails: true,
        currentOrganization: true,
        experienceSummary: true,
        currentStatus: true,
        socialLinks: true,
      },
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getUserProfile = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        skillsOffered: true,
        skillsWanted: true,
        professionDetails: true,
        currentOrganization: true,
        experienceSummary: true,
        currentStatus: true,
        socialLinks: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
