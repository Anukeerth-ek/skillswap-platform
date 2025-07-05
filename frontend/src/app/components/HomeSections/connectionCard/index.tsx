import React from 'react';
import { Heart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeacherCardProps {
  name: string;
  role: string;
  avatar: string;
  hourRate: number;
  experience: string;
  skills: string[];
  isBookmarked?: boolean;
}

export const ConnectionCard: React.FC<TeacherCardProps> = ({
  name,
  role,
  avatar,
  hourRate,
  experience,
  skills,
  isBookmarked = false
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-medium">{name}</h3>
            <p className="text-gray-400 text-sm">{role}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400">
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant={skill === 'Python' ? 'default' : 'secondary'}
            className={skill === 'Python' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'}
          >
            {skill}
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span className="text-white font-medium">${hourRate}/h</span>
        </div>
        <span className="text-gray-400 text-sm">{experience}</span>
      </div>
    </div>
  );
};
