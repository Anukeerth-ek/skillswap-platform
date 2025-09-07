"use client";
import React, { ReactEventHandler, useEffect, useState } from "react";
// import { Navbar } from '../app/components/HomeSections/Header/Navbar.tsx';
import { SearchBar } from "../app/components/Searchbar";
import { LeftSidebar } from "../app/components/HomeSections/Filters";
import { SearchResults } from "../app/components/HomeSections/searchResult";
import { User } from "@/types";
import { useGetMyProfile } from "./hooks/useGetMyProfile";
import { useGetUserConnections } from "./hooks/useGetUserConnection";
// import { ConnectionDetailSideBar } from '../app/components/HomeSections/connectionDetailPage';

export default function Home() {
     const [searchTerm, setSearchTerm] = useState("");
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);

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

     const { user: myData, loading: myDataLoading } = useGetMyProfile();

     const { usersConnection, loading: connectionLoading, error } = useGetUserConnections(myData?.id);

     const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value.toLowerCase());
     };

     const connectedIds = new Set(usersConnection.map((c) => c.user.id));

     const filteredUsers = users
          .filter((user) => !connectedIds.has(user.id))
          .filter((user) => {
               console.log("anu", user);
               return (
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.skillsOffered.some((s) => s.name.toLowerCase().includes(searchTerm))
               );
          });

     if (myDataLoading || connectionLoading) return <p>Loading...</p>;
     if (error) return <p>Error loading connections</p>;
console.log("hey", filteredUsers)
     return (
          <div className="min-h-screen bg-gray-900">
               {/* <Navbar /> */}
               <div className="flex">
                    <LeftSidebar />
                    <div className="flex-1 flex flex-col">
                         <div className="p-6">
                              <SearchBar handleUserSearch={handleUserSearch} />
                         </div>
                         <div className="flex flex-1">
                              <SearchResults
                                   users={filteredUsers}
                                   loading={loading}
                                   onUserClick={(user) => console.log("Selected user:", user)}
                              />
                              {/* <ConnectionDetailSideBar /> */}
                         </div>
                    </div>
               </div>
          </div>
     );
}
