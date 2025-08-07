import  prisma  from "../prismaClient";
import { createMeetEvent } from "../lib/googleCalendar";

export const acceptSession = async (req:any, res:any) => {
  const sessionId = req.params.id;

  try {
    const session = await prisma.session.findUnique({ where: { id: sessionId } });

    if (!session) return res.status(404).json({ message: "Session not found" });

    const startTime = session.scheduledAt.toISOString();
    const endTime = new Date(session.scheduledAt.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour

    const meetLink = await createMeetEvent({
      summary: `SkillSwap: ${session.skillId}`,
      description: "Mentorship Session",
      startTime,
      endTime,
    });

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "CONFIRMED",
        meetLink,
      },
    });

    res.json({ message: "Session confirmed", session: updated });
  } catch (error) {
    console.error("Error accepting session", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

