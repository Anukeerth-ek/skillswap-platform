import { Request, Response } from "express";
import prisma from "../prismaClient";
import jwt from "jsonwebtoken";
export const updateUserProfile = async (req: Request & { userId?: string }, res: Response) => {
     const { bio, avatarUrl, timeZone, skillsOffered, skillsWanted } = req.body;

     if (!req.userId) {
          res.status(401).json({ message: "Unauthorized" });
          return;
     }

     try {
          // 1. Upsert offered skills
          const offeredSkillRecords = await Promise.all(skillsOffered.map((name: string) => getOrCreateSkill(name)));

          // 2. Upsert needed skills
          const wantedSkillRecords = await Promise.all(skillsWanted.map((name: string) => getOrCreateSkill(name)));

          // 3. Update User profile and connect skills
          const updatedUser = await prisma.user.update({
               where: { id: req.userId },
               data: {
                    bio,
                    avatarUrl,
                    timeZone,
                    skillsOffered: {
                         set: [], // Clear old connections
                         connect: offeredSkillRecords.map((skill) => ({ id: skill.id })),
                    },
                    skillsWanted: {
                         set: [], // Clear old connections
                         connect: wantedSkillRecords.map((skill) => ({ id: skill.id })),
                    },
               },
               include: {
                    skillsOffered: true,
                    skillsWanted: true,
               },
          });

          res.status(200).json({ message: "Profile updated", user: updatedUser });
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error updating profile" });
     }
};

// helper
async function getOrCreateSkill(name: string) {
     return await prisma.skill.upsert({
          where: { name },
          update: {},
          create: { name },
     });
}


export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
         res.status(401).json({ message: "Unauthorized" });
         return 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: decoded.userId, // Exclude current user
        },
      },
      include: {
        skillsOffered: true,
      },
    });

    res.json({ users });
    return 
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
    return 
  }
};