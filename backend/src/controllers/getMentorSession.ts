import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMentorSessions = async (req: Request, res: Response) => {
  try {
    const mentorId = req.user?.id;

    if (!mentorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sessions = await prisma.session.findMany({
      where: { mentorId },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });

    return res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching mentor's sessions:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
