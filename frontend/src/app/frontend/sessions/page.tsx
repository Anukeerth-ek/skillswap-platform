"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  mentor: { name: string };
  learner: { name: string };
  skill: {name: string};
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  scheduledAt: string;
  meetLink?: string;
}

const SessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4000/api/sessions/my-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      const data = await res.json();
      console.log('data', data)
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleAction = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:4000/api/sessions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      fetchSessions(); // Refresh the session list
    } else {
      alert(data.message || "Failed to update session status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Sessions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border p-4 rounded-lg shadow-sm flex flex-col gap-2"
            >
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
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    session.status === "CONFIRMED"
                      ? "text-green-600 font-semibold"
                      : session.status === "PENDING"
                      ? "text-yellow-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {session.status}
                </span>
              </p>

              {/* Action buttons */}
              {session.status === "PENDING" && (
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleAction(session.id, "CONFIRMED")}>
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(session.id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </div>
              )}

              {/* Meet link button */}
              {session.status === "CONFIRMED" && session.meetLink && (
                <a
                  href={session.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="mt-2" variant="default">
                    Join Google Meet
                  </Button>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
