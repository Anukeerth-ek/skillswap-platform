import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share2, Bookmark } from "lucide-react";
interface Props {
     user: {
 id: string;
     name: string;
     email: string;
     bio?: string;
     avatarUrl?: string;
     role: "LEARNER" | "MENTOR" | string;
     timeZone?: string;
     createdAt: string;

     skillsOffered: { id: string; name: string }[];
     skillsWanted: { id: string; name: string }[];

     sessionsAsMentor: { id: string }[];
     sessionsAsLearner: { id: string }[];

     sentConnections: { id: string }[];
     receivedConnections: { id: string }[];

     followers: { id: string; followerId: string }[];
     following: { id: string; followingId: string }[];
     };
}

export const ConnectionDetailSideBar = ({ user }: Props) => {
     console.log("user", user)

  const [isFollowing, setIsFollowing] = useState(false)
     return (
          <div className=" bg-gray-900 text-white p-6">
               <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-between w-full">
                         <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="icon">
                                   <Share2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                   <Bookmark className="w-4 h-4" />
                              </Button>
                         </div>
                         <Button onClick={()=> setIsFollowing(!isFollowing)} className="border cursor-pointer hover:text-gray-100">{isFollowing ? 'Following' : 'Follow'}</Button>
                    </div>
               </div>

               <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                         <AvatarImage src="/api/placeholder/80/80" />
                         <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold mb-1">{user?.name}</h2>
                    <p className="text-gray-400 mb-4">Teacher</p>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                         {user.skillsOffered.map((skill, idx) => (
                              <Badge
                                   key={idx}
                                   className={`${
                                        skill.name === "Python"
                                             ? "bg-purple-600 hover:bg-purple-700"
                                             : "bg-gray-700 hover:bg-gray-600"
                                   }`}
                              >
                                   {skill.name}
                              </Badge>
                         ))}
                    </div>
               </div>

               <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                         <span className="text-gray-400">Readiness</span>
                         <span className="text-green-400">Hired</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">Experience</span>
                         <span className="text-white">15 years</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">Dialogue</span>
                         <span className="text-white">Zoom</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-gray-400">On this platform</span>
                         <span className="text-white">{user?.createdAt ? new Date(user?.createdAt).toLocaleDateString():'Today'}</span>
                    </div>
               </div>

               <div className="mb-6">
                    <h3 className="font-medium mb-3">Teacher description</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                     {user?.bio}
                    </p>
               </div>

               {/* <div className="mb-6">
                    <h3 className="font-medium mb-2">Hour rate</h3>
                    <p className="text-gray-400">$24/h</p>
               </div> */}

               <Button className="w-full bg-purple-600 cursor-pointer hover:bg-purple-700 text-white">
                    Add Connection
               </Button>
          </div>
     );
};
