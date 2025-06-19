import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
     user?: any;
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
     try {
          const authHeader = req.headers.authorization;
          const token = authHeader?.split(" ")[1]; // Expecting "Bearer <token>"

          if (!token) {
               res.status(401).json({ message: "Unauthorized: Token missing" });
               return;
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET!);
          req.user = decoded;
          next();
     } catch (err) {
          res.status(403).json({ message: "Forbidden: Invalid token" });
          return;
     }
};
