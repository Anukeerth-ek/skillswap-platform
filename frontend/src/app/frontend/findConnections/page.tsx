"use client"

import LeftSidebar from '@/app/components/HomeSections/Filters';
import { SearchResults } from '@/app/components/HomeSections/searchResult';
import { SearchBar } from '@/app/components/Searchbar';
import { useGetMyProfile } from '@/app/hooks/useGetMyProfile';
import { useGetUserConnections } from '@/app/hooks/useGetUserConnection';
import { User } from '@/types';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const FindConnections = () => {
     const [users, setUsers] = useState<User[]>([]);
         const [loading, setLoading] = useState(true);
    
         const [filters, setFilters] = useState({
              search: "",
              professional: [] as string[],
              experience: [] as string[],
              company: "",
              sort: "most-experienced",
              // hourRate: ,
              readiness: [""],
         });
    
         const { user: myData, loading: myDataLoading } = useGetMyProfile();
         const { usersConnection, loading: connectionLoading, error } = useGetUserConnections(myData?.id);
    
         const router = useRouter();
         // const searchParams = useSearchParams();
    
         // Update URL when filters change
         useEffect(() => {
              const params = new URLSearchParams();
              if (filters.search) params.set("search", filters.search);
              if (filters.company) params.set("company", filters.company);
              if (filters.professional.length) params.set("professional", filters.professional.join(","));
              if (filters.experience.length) params.set("experience", filters.experience.join(","));
              if (filters.sort) params.set("sort", filters.sort);
    
              router.replace(`?${params.toString()}`);
         }, [filters, router]);
    
         // const getBaseUrl = () => {
         //      // Use env variable if set
         //      if (process.env.NEXT_PUBLIC_USERS_LIST_URL) {
         //           return process.env.NEXT_PUBLIC_USERS_LIST_URL;
         //      }
    
         //      // Fallback based on environment
         //      if (process.env.NODE_ENV === "production") {
         //           return "https://skillswap-platform-ovuw.onrender.com";
         //      } else {
         //           return "http://localhost:4000";
         //      }
         // };
    
         // Fetch users when filters change
         useEffect(() => {
              const fetchUsers = async () => {
                   try {
                        setLoading(true);
    
                        const token = localStorage.getItem("token");
                        const headers: HeadersInit = {};
                        if (token) headers["Authorization"] = `Bearer ${token}`;
    
                        const params = new URLSearchParams();
                        if (filters.search) params.set("search", filters.search);
                        if (filters.company) params.set("company", filters.company);
                        if (filters.professional.length) params.set("professional", filters.professional.join(","));
                        if (filters.experience.length) params.set("experience", filters.experience.join(","));
                        if (filters.sort) params.set("sort", filters.sort);
    
                        const BASE_URL = getBaseUrl();
                        const url = `${BASE_URL}/api/filtered-profile/filter?${params.toString()}`;
    
                        const res = await fetch(url, { headers });
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
  return (
    <div className="flex mt-18">
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
  )
}

export default FindConnections