import { Request, Response } from "express";
import prisma from "../prismaClient";
import { comparePassword, hashPassword } from "../utils/hash.utils";

const jwt = require("jsonwebtoken");

export const signup = async (req: Request, res: Response) => {
     const { name, email, password } = req.body;

     if (!email || !password) {
          return res.status(400).json({ message: "Email and passsword is required" });
     }

     const existingUser = await prisma.user.findUnique({ where: email });

     if (existingUser) {
          return res.status(409).json({ message: "User already exist" });
     }

     const hashdedUserPassword = await hashPassword(password);

     const newUser = await prisma.user.create({
          data: { name, email, password: hashdedUserPassword },
     });

     res.status(201).json({ message: "user created", user: { id: newUser.id, email: newUser.password } });
};

export const login = async (req: Request, res: Response) => {
     const { email, passsword } = req.body;

     const user = await prisma.user.findUnique({ where: email });

     if (!user) {
          return res.status(404).json({ message: "User not found" });
     }

     const isValid = await comparePassword(passsword, user?.password);

     if (!isValid) {
          return res.status(404).json({ message: "Invalid Credientials" });
     }

     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1day" });

     res.json({ token });
};

export default { signup, login };
