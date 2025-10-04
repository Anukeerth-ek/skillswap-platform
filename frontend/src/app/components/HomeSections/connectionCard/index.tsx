import React, { useState } from "react";
import { Heart, Clock, Star, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeacherCardProps {
     name: string;
     role: string;
     avatar: string;
     // hourRate: number;
     professionTitle: string | undefined;
     companyName: string | undefined;
     experience: number | undefined;
     skills: string[];
     isBookmarked?: boolean;
     handleShowConnectionDetail?: () => void;
}

export const ConnectionCard: React.FC<TeacherCardProps> = ({
     name,
     role,
     avatar,
     // hourRate,
     professionTitle,
     companyName,
     experience,
     skills,
     isBookmarked = false,
     handleShowConnectionDetail,
}) => {
     const [isBookmark, setIsBookmark] = useState(isBookmarked);

     const toggleBookmark = () => {
          setIsBookmark(!isBookmark);
     };
     console.log("role", role)
     return (
          //    <div className="max-w-md mx-auto p-6 bg-gray-100">
          <div
               onClick={handleShowConnectionDetail}
               className="group bg-gray-900 cursor-pointer rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
               {/* Subtle gradient overlay */}
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

               {/* Header with avatar and bookmark */}
               <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex items-center space-x-4">
                         <div className="relative">
                              <Avatar className="w-14 h-14 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300">
                                   <AvatarImage src={avatar} className="object-cover" />
                                   <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold text-lg">
                                        {name.charAt(0).toUpperCase()}
                                   </AvatarFallback>
                              </Avatar>
                              {/* Online indicator */}
                              {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 shadow-lg">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
              </div> */}
                         </div>
                         <div className="flex-1">
                              <h3 className="text-white text-lg font-bold tracking-tight mb-1 group-hover:text-purple-100 transition-colors">
                                   {name}
                              </h3>
                              <div className="flex items-center space-x-0.5">
                                   {/* <User className="w-3 h-3 text-gray-400" /> */}
                                   <p className="text-sm text-gray-400 font-medium">{professionTitle ?? "Not Provided"}</p>
                              </div>
                         </div>
                    </div>

                    <Button
                         variant="ghost"
                         size="icon"
                         className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-full transition-all duration-200 relative z-20"
                         onClick={toggleBookmark}
                    >
                         <Heart
                              className={`w-5 h-5 transition-all duration-200 ${
                                   isBookmark ? "fill-purple-500 text-purple-500 scale-110" : "hover:scale-110"
                              }`}
                         />
                    </Button>
               </div>

               {/* Skills section */}
               <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    {skills.map((skill, index) => {
                         //   const isPython = skill.toLowerCase() === "python";
                         //   const isJava = skill.toLowerCase() === "java";

                         return (
                              <Badge
                                   key={index}
                                   className=//   {`
                                   " rounded-full px-4 py-1 text-xs font-semibold border transition-all duration-200 hover:scale-105 bg-slate-700/80 text-gray-300 border-slate-600/50 hover:bg-slate-700 hover:text-white"

                                   //    isPython
                                   //      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500/50 shadow-lg shadow-purple-500/20"
                                   //      : isJava
                                   //      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-500/50 shadow-lg shadow-orange-500/20"
                                   // :

                                   //  }`}
                              >
                                   {skill}
                              </Badge>
                         );
                    })}
               </div>

               {/* Footer with profession and experience */}
               <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-2">
                         <Star className="w-4 h-4 text-gray-400" />
                         {/* <Dot className="text-gray-200"/> */}
                         <span className="text-white font-bold text-base tracking-wide">
                              {companyName ?? "Not Provided"}
                         </span>
                    </div>

                    <div className="flex items-center space-x-2 px-3 py-2">
                         {/* <Clock className="w-4 h-4 text-gray-400" /> */}
                         <span className="text-gray-300 font-semibold text-sm">
                              {experience ? `${experience} Years` : "Not Provided"}
                         </span>
                    </div>
               </div>

               {/* Hover effect line */}
               {/* <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-500 ease-out" /> */}
          </div>
          //     </div>
     );
};
