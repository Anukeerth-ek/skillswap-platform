"use client";

import React from "react";
import { Home, BookOpen, Users, MessageCircle, Bell, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMyProfile } from "@/app/hooks/useGetMyProfile";
import Link from "next/link";
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export const Navbar = () => {
     const { user, loading } = useGetMyProfile();

     const displayName = loading ? "Loading..." : user?.name || "Guest";
     const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "G";
     const avatarUrl = user?.avatarUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

     const pathname = usePathname();

     const isActive = (path: string) => pathname === path;
     return (
     
              <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                         <div className="flex items-center justify-between">
                              {/* Logo */}
                              <div className="flex items-center gap-2">
                                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground">
                                        L
                                   </div>
                                   <span className="text-xl font-bold text-white">Swapper</span>
                              </div>

                              {/* Desktop Navigation */}
                               <div className="flex items-center space-x-6">
                         <Link href="/">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   className={
                                        isActive("/")
                                             ? "text-purple-400 hover:text-purple-900 cursor-pointer border-b-2 border-purple-400 "
                                             : "text-gray-300 hover:text-black cursor-pointer"
                                   }
                              >
                                   <Home className="w-4 h-4 mr-2" />
                                   Home
                              </Button>
                         </Link>
                         {/* <Button
                         variant="ghost"
                         size="sm"
                         className="text-purple-400 hover:text-purple-900 cursor-pointer border-b-2 border-purple-400"
                    >
                         <UserPlus className="w-4 h-4 mr-2" />
                         Find SkillMate
                    </Button> */}
                         <Link href="/frontend/connections">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   className={
                                        isActive("/frontend/connections")
                                             ? "text-purple-400 hover:text-purple-900 cursor-pointer border-b-2 border-purple-400 "
                                             : "text-gray-300 hover:text-black cursor-pointer"
                                   }
                              >
                                   <Users className="w-4 h-4 mr-2" />
                                   My Connections
                              </Button>
                         </Link>
                         <Link href="/frontend/sessions">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   className={
                                        isActive("/frontend/sessions")
                                             ? "text-purple-400 hover:text-purple-900 cursor-pointer border-b-2 border-purple-400 "
                                             : "text-gray-300 hover:text-black cursor-pointer"
                                   }
                              >
                                   <BookOpen className="w-4 h-4 mr-2" />
                                   My Sessions
                              </Button>
                         </Link>
                         <Link href="/frontend/chat">
                              <Button
                                   variant="ghost"
                                   size="sm"
                                   className={
                                        isActive("/frontend/chat")
                                             ? "text-purple-400 hover:text-purple-900 cursor-pointer border-b-2 border-purple-400 "
                                             : "text-gray-300 hover:text-black cursor-pointer"
                                   }
                              >
                                   <MessageCircle className="w-4 h-4 mr-2" />
                                   Messages
                              </Button>
                         </Link>
                    </div>

                              <div className="flex items-center space-x-4">
                                   {loading ? (
                                        <span className="text-sm text-gray-300 hidden sm:inline">Loading...</span>
                                   ) : user ? (
                                        <>
                                             <span className="text-sm text-gray-300 hidden sm:inline">
                                                  Hi, {displayName}
                                             </span>
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-sm text-gray-300 hover:text-white"
                                             >
                                                  <Bell className="w-5 h-5" />
                                             </Button>

                                             {/* Dropdown Avatar */}
                                             <DropdownMenu>
                                                  <DropdownMenuTrigger asChild>
                                                       <Avatar className="w-8 h-8 cursor-pointer border border-white">
                                                            <AvatarImage src={avatarUrl} />
                                                            <AvatarFallback>{avatarLetter}</AvatarFallback>
                                                       </Avatar>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent align="end" className="w-48">
                                                       <DropdownMenuItem asChild>
                                                            <Link href="/profile" className="flex items-center w-full">
                                                                 <Settings className="w-4 h-4 mr-2" />
                                                                 Edit Profile
                                                            </Link>
                                                       </DropdownMenuItem>
                                                       <DropdownMenuSeparator />
                                                       <DropdownMenuItem
                                                            className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                 localStorage.removeItem("token");
                                                                 window.location.href = "/login";
                                                            }}
                                                       >
                                                            <LogOut className="w-4 h-4 mr-2" />
                                                            Logout
                                                       </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                             </DropdownMenu>
                                        </>
                                   ) : (
                                        <Link href="/login">
                                             <Button
                                                  variant="outline"
                                                  className="text-black cursor-pointer border-white hover:bg-white hover:text-gray-900"
                                             >
                                                  Login
                                             </Button>
                                        </Link>
                                   )}
                              </div>
                         </div>
                    </div>
               </nav>
         
     );
};
