"use client";

import React, { useEffect, useState } from "react";
import { ConnectionCard } from "../connectionCard/index";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConnectionDetailSideBar } from "../connectionDetailPage";

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


export const SearchResults = () => {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [selectedUser, setSelectedUser] = useState<User | null>(null);
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     useEffect(() => {
          const fetchUsers = async () => {
               try {
                    const token = localStorage.getItem("token");
                    const res = await fetch("http://localhost:4000/api/profile/all", {
                         headers: {
                              Authorization: `Bearer ${token}`,
                         },
                    });
                    const data = await res.json();
                    setUsers(data.users);
               } catch (error) {
                    console.error("Failed to fetch users", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchUsers();
     }, []);

     const handleCardClick = (user: User) => {
          setSelectedUser(user);
          setIsSidebarOpen(true);
     };

     return (
          <>
               <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-xl font-semibold text-white">Search Results</h2>
                         <span className="text-gray-400">{loading ? "Loading..." : `${users?.length} results found`}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {users &&
                              users?.map((user) => (
                                   <ConnectionCard
                                        key={user.id}
                                        name={user.name}
                                        role={user.role}
                                        avatar={user.avatarUrl || "/default-avatar.png"}
                                        hourRate={Math.floor(Math.random() * 20) + 15}
                                        experience={"5Years of Experience"}
                                        skills={user.skillsOffered.map((s) => s.name)}
                                        handleShowConnectionDetail={() => handleCardClick(user)}
                                   />
                              ))}
                    </div>
               </div>

               <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent
                         side="right"
                         className="border-l-0 w-[25rem] sm:w-[400px] bg-gray-900 text-white overflow-auto"
                    >
                         <SheetHeader className="cursor-pointer">
                              <SheetTitle className="text-white">Connection Details</SheetTitle>
                         </SheetHeader>
                         {selectedUser && (
                              <div className="mt-4">
                                   <ConnectionDetailSideBar user={selectedUser} />
                              </div>
                         )}
                    </SheetContent>
               </Sheet>
          </>
     );
};
