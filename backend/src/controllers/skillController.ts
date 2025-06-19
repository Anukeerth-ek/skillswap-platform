import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { string, z } from "zod";

const prisma = new PrismaClient();

// Zod schema for validation
const skillSchema = z.object({
     name: z.string().min(2, "Skill name must be at least 2 characters"),
});

// POST /api/skills - Add new skill
export const addSkill = async (req: Request, res: Response) => {
     const validation = skillSchema.safeParse(req.body);

     if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
     }

     const { name } = validation.data;

     try {
          const existingSkill = await prisma.skill.findFirst({ where: { name } });
          if (existingSkill) {
               return res.status(409).json({ message: "Skill already exists" });
          }

          const newSkill = await prisma.skill.create({ data: { name } });
          return res.status(201).json(newSkill);
     } catch (error) {
          console.error("Error adding skill:", error);
          return res.status(500).json({ message: "Internal server error" });
     }
};

// GET /api/skills - List all skills
export const listSkills = async (_req: Request, res: Response) => {
     try {
          const skills = await prisma.skill.findMany();
          return res.status(200).json(skills);
     } catch (error) {
          console.error("Error fetching skills:", error);
          return res.status(500).json({ message: "Internal server error" });
     }
};
