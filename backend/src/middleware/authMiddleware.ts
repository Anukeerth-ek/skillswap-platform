import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface JwtPayload {
  userId: string; // ✅ match exactly what you signed
}

export const authenticateUser = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token" });
    return 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(403).json({ message: "Forbidden: Invalid token" });
    return 
  }
};
