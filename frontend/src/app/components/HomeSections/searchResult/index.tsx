"use client";

import React, { useEffect, useState } from "react";
import { ConnectionCard } from "../connectionCard/index";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConnectionDetailSideBar } from "../connectionDetailPage";
import { User } from "@/types";

type SearchResultsProps = {
     users: User[];
     loading: boolean;
     // onUserClick: (user: User) => void;
};

export const SearchResults = ({ users, loading,  }: SearchResultsProps) => {
     const [selectedUser, setSelectedUser] = useState<User | null>(null);
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     const handleCardClick = (user: User) => {
          setSelectedUser(user);
          setIsSidebarOpen(true);
          // onUserClick(user);
     };

     // Close sidebar if selected user no longer in filtered results
     useEffect(() => {
          if (selectedUser && !users.find((u) => u.id === selectedUser.id)) {
               setSelectedUser(null);
               setIsSidebarOpen(false);
          }
     }, [users]);

     if (loading) return <p>Loading...</p>;
     console.log("user", users)
     return (
          <>
               <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-xl font-semibold text-white">Search Results</h2>
                         <span className="text-gray-400">{users?.length} results found</span>
                    </div>

                    {users?.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {users?.map((user) => (
                                   <ConnectionCard
                                        key={user?.id}
                                        name={user?.name}
                                        role={user?.role}
                                        avatar={user?.avatarUrl || "/default-avatar.png"}
                                        hourRate={Math.floor(Math.random() * 20) + 15}
                                        experience={user?.experienceSummary?.years}
                                        skills={user?.skillsOffered?.map((s) => s.name) || []} 
                                        handleShowConnectionDetail={() => handleCardClick(user)}
                                   />
                              ))}
                         </div>
                    ) : (
                         <p className="text-white text-center font-semibold">
                              No User Found, Please adjust the applied Filter.
                         </p>
                    )}
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
