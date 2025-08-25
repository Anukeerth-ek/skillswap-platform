"use client";

import { useEffect, useState } from "react";

interface Session {
  id: string;
  mentor: { name: string };
  learner: { name: string };
  skill: { name: string };
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  scheduledAt: string;
  meetLink?: string;
}

export default function SessionDetail({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedSession");
    if (saved) {
        console.log("anukee", JSON.parse(saved))
      setSession(JSON.parse(saved));
    }
  }, []);
  if (!session) return <p>Loading session...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Session Details</h1>
      <div className="space-y-3 border p-4 rounded-lg shadow">
        <p>
          <strong>Learner:</strong> {session.learner.name}
        </p>
        <p>
          <strong>Skill:</strong> {session.skill.name}
        </p>
        <p>
          <strong>Time:</strong>{" "}
          {new Date(session.scheduledAt).toLocaleString()}
        </p>
    

        {session.status === "CONFIRMED" && session.meetLink && (
          <a
            href={session.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Join Google Meet
          </a>
        )}
      </div>
    </div>
  );
}
