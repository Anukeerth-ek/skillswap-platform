"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
// import { json } from "stream/consumers";

interface Session {
     id: string;
     mentor: { name: string };
     learner: { name: string };
     skill: { name: string };
     status: "PENDING" | "CONFIRMED" | "REJECTED";
     scheduledAt: string;
     meetLink?: string;
}

const SessionsPage = () => {
     const [sessions, setSessions] = useState<Session[]>([]);
     const [loading, setLoading] = useState(true);
     const [approvingSession, setApprovingSession] = useState<string | null>(null);

     const fetchSessions = async () => {
          const token = localStorage.getItem("token");
          if (!token) return;

          try {
               const res = await fetch("https://skillswap-platform-ovuw.onrender.com/api/sessions/my-sessions", {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               });

               const data = await res.json();
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

     const approveSession = async (id: string) => {
          const token = localStorage.getItem("token");
          if (!token) return;

          setApprovingSession(id);

          try {
               // 1️⃣ Check if Google tokens are saved
               const res = await fetch("https://skillswap-platform-ovuw.onrender.com/api/google-token/status", {
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               });

               if (!res.ok) {
                    console.error("Failed to check Google Calendar connection:", res.status);
                    // If we can't check, try to approve anyway and let the backend handle it
                    await updateSessionStatus(id, "CONFIRMED");
                    return;
               }

               const { hasTokens } = await res.json();

               // 2️⃣ If no tokens → redirect to OAuth flow, passing token in query string
               if (!hasTokens) {
                    console.log("No Google tokens found, redirecting to OAuth...");
                    window.location.href = `https://skillswap-platform-ovuw.onrender.com/api/google/auth?token=${token}`;
                    return;
               }

               // 3️⃣ If tokens exist → approve session
               console.log("Google tokens found, proceeding with approval...");
               await updateSessionStatus(id, "CONFIRMED");
          } catch (err) {
               console.error("Error checking Google Calendar status:", err);
               // If the check fails, try to approve anyway and let the backend handle it
               await updateSessionStatus(id, "CONFIRMED");
          } finally {
               setApprovingSession(null);
          }
     };

     const rejectSession = async (id: string) => {
          await updateSessionStatus(id, "REJECTED");
     };

     const updateSessionStatus = async (id: string, status: "CONFIRMED" | "REJECTED") => {
          const token = localStorage.getItem("token");
          if (!token) return;

          try {
               const res = await fetch(`https://skillswap-platform-ovuw.onrender.com/api/sessions/approve/${id}`, {
                    method: "PATCH",
                    headers: {
                         "Content-Type": "application/json",
                         Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
               });

               if (!res.ok) {
                    const data = await res.json();
                    console.error("Session update error:", data);

                    // Show more specific error messages
                    if (data.message?.includes("Google Calendar not connected") || data.message?.includes("Google Meet")) {
                         alert("Google Calendar needs to be reconnected. You'll be redirected to Google OAuth.");
                         // Redirect to OAuth flow to get fresh tokens with correct scopes
                         window.location.href = `https://skillswap-platform-ovuw.onrender.com/api/google/auth?token=${token}`;
                         return;
                    } else {
                         alert(data.message || "Failed to update session status");
                    }
               } else {
                    await fetchSessions();
                    if (status === "CONFIRMED") {
                         alert("Session approved! Google Meet link has been created and sent to participants.");
                    }
               }
          } catch (error) {
               console.error("Error updating session status:", error);
               alert("Failed to update session status. Please try again.");
          }
     };

     const deleteSession = async (id: string) => {
          const token = localStorage.getItem("token");
          if (!token) return;

          if (!confirm("Are you sure you want to delete this session?")) return;

          try {
               const res = await fetch(`https://skillswap-platform-ovuw.onrender.com/api/sessions/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                         Authorization: `Bearer ${token}`,
                    },
               });

               if (!res.ok) {
                    const data = await res.json();
                    alert(data.message || "Failed to delete session");
               } else {
                    fetchSessions();
               }
          } catch (error) {
               console.error("Error deleting session:", error);
          }
     };

     const router = useRouter();

     const handleSessions = (session: Session) => {
          localStorage.setItem("selectedSession", JSON.stringify(session));
          router.push(`/frontend/sessions/${session.id}`);
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
                                   className="border p-4 rounded-lg cursor-pointer shadow-sm flex flex-col gap-2"
                                   onClick={() => handleSessions(session)}
                              >
                                   <p>
                                        <strong>Learner:</strong> {session.learner.name}
                                   </p>
                                   <p>
                                        <strong>Skill:</strong> {session.skill.name}
                                   </p>
                                   <p>
                                        <strong>Time:</strong> {new Date(session.scheduledAt).toLocaleString()}
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

                                   {session.status === "PENDING" && (
                                        <div className="flex justify-between gap-2 mt-2">
                                             <div className="flex gap-2 mt-2">
                                                  <Button
                                                       onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            approveSession(session.id);
                                                       }}
                                                       className="cursor-pointer"
                                                       disabled={approvingSession === session.id}
                                                  >
                                                       {approvingSession === session.id ? "Creating Meet..." : "Approve"}
                                                  </Button>
                                                  <Button
                                                       variant="destructive"
                                                       className="cursor-pointer"
                                                       onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            rejectSession(session.id);
                                                       }}
                                                       disabled={approvingSession === session.id}
                                                  >
                                                       Reject
                                                  </Button>
                                             </div>
                                        </div>
                                   )}
                                   <div className="flex justify-end">
                                        <Button
                                             variant="outline"
                                             onClick={(e) => {
                                                  e.stopPropagation();
                                                  e.preventDefault();
                                                  deleteSession(session.id);
                                             }}
                                             className="cursor-pointer"
                                        >
                                             <Trash2 />
                                        </Button>
                                   </div>
                                   {session.status === "CONFIRMED" && session.meetLink && (
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                             <p className="text-sm text-green-800 mb-2">
                                                  <strong>✅ Session Confirmed!</strong> Google Meet link has been created.
                                             </p>
                                             <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                                                  <Button className="w-full" variant="default">
                                                       🎥 Join Google Meet
                                                  </Button>
                                             </a>
                                        </div>
                                   )}
                              </div>
                         ))}
                    </div>
               )}
          </div>
     );
};

export default SessionsPage;
