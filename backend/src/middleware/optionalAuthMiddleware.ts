import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  console.log("optionalAuth triggered");

  if (!token) return next();

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  req.user = decoded;
} catch (err) {
  console.warn("⚠️ Invalid token, ignoring auth");
  // Don’t send 401 — just skip user
}
next();

};
