import { Request, Response } from "express";
import prisma from "../prismaClient";
import jwt from "jsonwebtoken";

export const updateUserProfile = async (req: Request & { userId?: string }, res: Response) => {
     const {
          bio,
          avatarUrl,
          timeZone,
          skillsOffered,
          skillsWanted,
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

     if (!req.userId) {
          res.status(401).json({ message: "Unauthorized" });
          return;
     }

     try {
          // 1. Upsert skills
          const offeredSkillRecords = await Promise.all(skillsOffered.map((name: string) => getOrCreateSkill(name)));

          const wantedSkillRecords = await Promise.all(skillsWanted.map((name: string) => getOrCreateSkill(name)));

          // 2. Update user with nested profile info
          const updatedUser = await prisma.user.update({
               where: { id: req.userId },
               data: {
                    bio,
                    avatarUrl,
                    timeZone,
                    skillsOffered: {
                         set: [],
                         connect: offeredSkillRecords.map((skill) => ({ id: skill.id })),
                    },
                    skillsWanted: {
                         set: [],
                         connect: wantedSkillRecords.map((skill) => ({ id: skill.id })),
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

          res.status(200).json({ message: "Profile updated", user: updatedUser });
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error updating profile" });
     }
};

async function getOrCreateSkill(name: string) {
     return await prisma.skill.upsert({
          where: { name },
          update: {},
          create: { name },
     });
}

export const getAllProfiles = async (req: Request, res: Response) => {
     try {
          let currentUserId: string | null = null;

          const authHeader = req.headers.authorization;
          const token = authHeader?.split(" ")[1];

          if (token) {
               try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
                    currentUserId = decoded.userId;
               } catch {
                    console.log("Invalid token");
               }
          }

          const users = await prisma.user.findMany({
               where: currentUserId ? { id: { not: currentUserId } } : {},
               include: {
                    skillsOffered: true,
                    professionDetails: true,
                    currentOrganization: true,
                    experienceSummary: true,
                    currentStatus: true,
                    socialLinks: true,
                    receivedConnections: {
                         select: {
                              id: true,
                              senderId: true,
                         },
                    },
                    sentConnections: {
                         select: {
                              id: true,
                              receiverId: true,
                         },
                    },
               },
          });

          res.json({ users });
     } catch (error) {
          console.error("Error fetching users:", error);
          res.status(500).json({ message: "Server error" });
     }
};
