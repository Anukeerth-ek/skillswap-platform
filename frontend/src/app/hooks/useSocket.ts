"use client"

import { useEffect } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function useSocket(userId: string | undefined) {
  useEffect(() => {
    if (!userId) return;

    socket = io("http://localhost:4000", {
      query: { userId },
    });

    socket.on("connection:request", (data) => {
      toast("📩 New Connection Request", {
        description: `From user ID: ${data.senderId}`,
      });
    });

    socket.on("connection:accepted", (data) => {
      toast("✅ Connection Accepted", {
        description: `Your request to ${data.receiverId} was accepted.`,
      });
    });

    socket.on("follow:received", (data) => {
      toast("👤 New Follower", {
        description: `User ${data.followerId} started following you.`,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
}
