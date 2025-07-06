// hooks/useAuthUser.ts
"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
  avatarUrl?: string;
  email?: string;
};

export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log("helo", res)
        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
