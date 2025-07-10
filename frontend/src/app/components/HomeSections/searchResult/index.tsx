"use client";

import React, { useEffect, useState } from "react";
import { ConnectionCard } from "../connectionCard/index";

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  bio?: string;
  skillsOffered: { name: string }[];
};

export const SearchResults = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // if auth protected
        const res = await fetch("http://localhost:4000/api/profile/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("anu",data)
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // console.log("user", users)

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Search Results</h2>
        <span className="text-gray-400">
          {loading ? "Loading..." : `${users?.length} results found`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users && users.length > 1 ? users?.map((user) => (
          <ConnectionCard
            key={user.id}
            name={user.name}
            role={user.role}
            avatar={user.avatarUrl || "/default-avatar.png"}
            hourRate={Math.floor(Math.random() * 20) + 15} // Random for now
            experience={user.bio || "No experience mentioned"}
            skills={user.skillsOffered.map((s) => s.name)}
          />
        )) : <p className="text-white text-center">No users found </p>}
      </div>
    </div>
  );
};
