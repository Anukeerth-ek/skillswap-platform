"use client";
import React, { useEffect, useState } from "react";
import { SearchBar } from "../app/components/Searchbar";
import { LeftSidebar } from "../app/components/HomeSections/Filters";
import { SearchResults } from "../app/components/HomeSections/searchResult";
import { User } from "@/types";
import { useGetMyProfile } from "./hooks/useGetMyProfile";
import { useGetUserConnections } from "./hooks/useGetUserConnection";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    professional: [] as string[],
    experience: [] as string[],
    company: "",
    sort: "most-experienced",
  });

  const { user: myData, loading: myDataLoading } = useGetMyProfile();
  const { usersConnection, loading: connectionLoading, error } = useGetUserConnections(myData?.id);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.company) params.set("company", filters.company);
    if (filters.professional.length) params.set("professional", filters.professional.join(","));
    if (filters.experience.length) params.set("experience", filters.experience.join(","));
    if (filters.sort) params.set("sort", filters.sort);

    router.replace(`?${params.toString()}`);
  }, [filters]);

  // Fetch users when filters change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.company) params.set("company", filters.company);
        if (filters.professional.length) params.set("professional", filters.professional.join(","));
        if (filters.experience.length) params.set("experience", filters.experience.join(","));
        if (filters.sort) params.set("sort", filters.sort);

        const res = await fetch(`http://localhost:4000/api/filtered-profile/filter?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filters]);

  if (myDataLoading || connectionLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading connections</p>;

  const connectedIds = new Set(usersConnection.map((c) => c.user.id));
  const visibleUsers = users?.filter((user) => !connectedIds.has(user.id));
  console.log('visible', visibleUsers)
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <LeftSidebar filters={filters} setFilters={setFilters} />
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <SearchBar
              handleUserSearch={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-1">
            <SearchResults
              users={visibleUsers}
              loading={loading}
              // onUserClick={}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
