"use client";

import { useSession } from "next-auth/react";
import { Toaster } from "sonner";
import useSocket from "@/app/hooks/useSocket";

export const ClientProviders = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useSocket(userId);

  return <Toaster />;
};
