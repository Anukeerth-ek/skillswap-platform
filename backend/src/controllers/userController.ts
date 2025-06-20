import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getUserProfile = async (req: Request, res: Response) => {
     const { id } = req.params;

     try {
          const user = await prisma.user.findUnique({
               where: { id },
               select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    avatarUrl: true,
                    role: true,
                    createdAt: true,
               },
          });

          if (!user) {
               res.status(404).json({ message: "User not found" });
               return;
          }

          res.json(user);
          return;
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
          return;
     }
};

export const updateUserProfile = async (req: Request, res: Response) => {
     const { id } = req.params;
     const { name, bio, avatarUrl } = req.body;

     try {
          const updatedUser = await prisma.user.update({
               where: { id },
               data: {
                    name,
                    bio,
                    avatarUrl,
               },
          });

          res.json(updatedUser);
          return;
     } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error updating user" });
          return;
     }
};
