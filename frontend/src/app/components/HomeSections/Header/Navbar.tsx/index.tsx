"use client";

import React from "react";
import { Home, UserPlus, BookOpen, Users, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthUser } from "@/app/hooks/useAuth";
import Link from "next/link";

export const Navbar = () => {
     const { user, loading } = useAuthUser();
     console.log("user", user)
     console.log("user", user);
     const displayName = loading ? "Loading..." : user?.name || "Guest";
     const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "G";
     const avatarUrl = user?.avatarUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
   return (
  <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">L</span>
        </div>
        <span className="text-xl font-semibold">Leaning</span>
      </div>

      <div className="flex items-center space-x-6">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-400 hover:text-white border-b-2 border-purple-400"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Find Teacher
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <BookOpen className="w-4 h-4 mr-2" />
          My Courses
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Users className="w-4 h-4 mr-2" />
          My Teachers
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          Messages
        </Button>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      {loading ? (
        <span className="text-sm text-gray-300 hidden sm:inline">Loading...</span>
      ) : user ? (
        <>
          <span className="text-sm text-gray-300 hidden sm:inline">Hi, {displayName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login"; // full reload to clear any protected data
            }}
            className="text-sm text-red-400 hover:text-white"
          >
            Logout
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Link href="/profile">
            <Avatar className="w-8 h-8">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{avatarLetter}</AvatarFallback>
            </Avatar>
          </Link>
        </>
      ) : (
        <Link href="/login">
          <Button variant="outline" className="text-black cursor-pointer border-white hover:bg-white hover:text-gray-900">
            Login
          </Button>
        </Link>
      )}
    </div>
  </nav>
);

};
