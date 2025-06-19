import { Request, Response, NextFunction } from 'express'
const jwt = require('jsonwebtoken')

interface AuthRequest extends Request {
  user?: any
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' })
  }
}
