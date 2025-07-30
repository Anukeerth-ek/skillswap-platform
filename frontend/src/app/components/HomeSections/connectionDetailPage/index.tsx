"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAuthUser } from "@/app/hooks/useAuth"; 

type User = {
     id: string;
     name: string;
     email: string;
     bio?: string;
     avatarUrl?: string;
     role: "LEARNER" | "MENTOR" | string;
     timeZone?: string;
     createdAt: string;

     skillsOffered: { id: string; name: string }[];
     skillsWanted: { id: string; name: string }[];

     sessionsAsMentor: { id: string }[];
     sessionsAsLearner: { id: string }[];

     sentConnections: { id: string; receiverId: string }[];
     receivedConnections: { id: string; senderId: string }[];

     followers: { id: string; followerId: string }[];
     following: { id: string; followingId: string }[];
};

export const ConnectionDetailSideBar = ({ user }: { user: User }) => {

     const [connectionSent, setConnectionSent] = useState(false);
     const { user: currentUser } = useAuthUser();
     
     useEffect(() => {
          if (!currentUser?.id || !user?.id) return;


          const sent = user.receivedConnections?.some((connection) => connection.senderId === currentUser.id);
          const received = user.sentConnections?.some((connection) => connection.receiverId === currentUser.id);

          if (sent || received) {
               setConnectionSent(true);
          }
     }, [currentUser?.id, user]);

     const [isFollowing, setIsFollowing] = useState(false);

     const handleSendConnection = async () => {
          if (!currentUser?.id) {
               toast.error("You must be logged in to connect");
               return;
          }

          try {
               const response = await fetch("http://localhost:4000/api/connections/request", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         senderId: currentUser.id,
                         receiverId: user.id,
                    }),
               });

               const data = await response.json();

               if (!response.ok) {
                    // Check if error is "Connection already exists"
                    if (data.message === "Connection already exists") {
                         toast.info("Connection already exists");
                         setConnectionSent(true); // ⬅️ Still set this to update UI
                    } else {
                         toast.error(data.message || "Failed to send request");
                    }
                    return;
               }

               setConnectionSent(true);
               toast.success("Connection request sent! ✅");
          } catch (err) {
               console.error("Send connection error", err);
               toast.error("Something went wrong");
          }
     };


     return (
          <div className=" bg-gray-900 text-white p-6">
               <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-between w-full">
                         <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                   <Share2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                   <Bookmark className="w-4 h-4" />
                              </Button>
                         </div>
                         <Button
                              onClick={() => setIsFollowing(!isFollowing)}
                              className="border cursor-pointer hover:text-gray-100"
                         >
                              {isFollowing ? "Following" : "Follow"}
                         </Button>
                    </div>
               </div>

               <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                         <AvatarImage src="/api/placeholder/80/80" />
                         <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
                    <p className="text-gray-400 mb-4">Teacher</p>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                         {user.skillsOffered.map((skill, idx) => (
                              <Badge
                                   key={idx}
                                   className={`${
                                        skill.name === "Python"
                                             ? "bg-purple-600 hover:bg-purple-700"
                                             : "bg-gray-700 hover:bg-gray-600"
                                   }`}
                              >
                                   {skill.name}
                              </Badge>
                         ))}
                    </div>
               </div>

               <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                         <span className="text-gray-400">Readiness</span>
                         <span className="text-green-400">Hired</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">Experience</span>
                         <span className="text-white">15 years</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">Dialogue</span>
                         <span className="text-white">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">On this platform</span>
                         <span className="text-white">
                              {user?.createdAt ? new Date(user?.createdAt).toLocaleDateString() : "Today"}
                         </span>
                    </div>
               </div>

               <div className="mb-6">
                    <h3 className="font-medium mb-3">Teacher description</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{user?.bio}</p>
               </div>

               {/* <div className="mb-6">
                    <h3 className="font-medium mb-2">Hour rate</h3>
                    <p className="text-gray-400">$24/h</p>
               </div> */}

               <Button
                    onClick={handleSendConnection}
                    disabled={connectionSent}
                    className="w-full bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
               >
                    {connectionSent ? "Request Sent ✅" : "Add Connection"}
               </Button>
          </div>
     );
};
