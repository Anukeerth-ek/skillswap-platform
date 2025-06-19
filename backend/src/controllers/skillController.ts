import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { string, z } from "zod";

const prisma = new PrismaClient();

// Zod schema for validation
const skillSchema = z.object({
     name: z.string().min(2, "Skill name must be at least 2 characters"),
});

// POST /api/skills - Add new skill
export const addSkill = async (req: Request, res: Response): Promise<void> => {
     const validation = skillSchema.safeParse(req.body);

     if (!validation.success) {
          res.status(400).json({ error: validation.error.errors });
          return;
     }

     const { name } = validation.data;

     try {
          const existingSkill = await prisma.skill.findFirst({ where: { name } });
          if (existingSkill) {
               res.status(409).json({ message: "Skill already exists" });
               return;
          }

          const newSkill = await prisma.skill.create({ data: { name } });
          res.status(201).json(newSkill);
          return;
     } catch (error) {
          console.error("Error adding skill:", error);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};

// GET /api/skills - List all skills
export const listSkills = async (_req: Request, res: Response): Promise<void> => {
     try {
          const skills = await prisma.skill.findMany();
          res.status(200).json(skills);
          return;
     } catch (error) {
          console.error("Error fetching skills:", error);
          res.status(500).json({ message: "Internal server error" });
          return;
     }
};
