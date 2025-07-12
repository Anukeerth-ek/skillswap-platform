import React, { useState } from "react";
import { Heart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeacherCardProps {
     name: string;
     role: string;
     avatar: string;
     hourRate: number;
     experience: string;
     skills: string[];
     isBookmarked?: boolean;
     handleShowConnectionDetail?: () => void;
}

export const ConnectionCard: React.FC<TeacherCardProps> = ({
     name,
     role,
     avatar,
     hourRate,
     experience,
     skills,
     isBookmarked = false,
     handleShowConnectionDetail,
}) => {
     const [isBookmark, setIsBookmark] = useState(isBookmarked);

     const toggleBookmark = () => {
          setIsBookmark(!isBookmark);
     };
     return (
          <div onClick={ handleShowConnectionDetail} className="bg-slate-800 cursor-pointer rounded-xl p-5 border border-[#2d203f] hover:border-purple-500 transition-colors">
               <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                         <Avatar className="w-12 h-12">
                              <AvatarImage src={avatar} />
                              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                              <h3 className="text-white text-base font-semibold">{name}</h3>
                              <p className="text-sm text-gray-400">{role}</p>
                         </div>
                    </div>
                    <Button
                         variant="ghost"
                         size="icon"
                         className="text-gray-400 cursor-pointer hover:text-purple-400"
                         onClick={() => toggleBookmark()}
                    >
                         <Heart className={`w-4 h-4 ${isBookmark ? "fill-purple-500 text-purple-500" : ""}`} />
                    </Button>
               </div>

               <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map((skill, index) => (
                         <Badge
                              key={index}
                              variant="secondary"
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                   skill === "Python" ? "bg-purple-600 text-white" : "text-gray-300"
                              }`}
                              style={skill !== "Python" ? { backgroundColor: "#2d2338" } : {}}
                         >
                              {skill}
                         </Badge>
                    ))}
               </div>

               <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                         <DollarSign className="w-4 h-4 text-purple-400" />
                         <span className="text-white font-semibold">${hourRate}/h</span>
                    </div>
                    <span className="text-gray-400">{experience}</span>
               </div>
          </div>
     );
};
