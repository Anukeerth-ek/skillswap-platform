import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Share2, Bookmark } from 'lucide-react';

export const RightSidebar = () => {
  return (
    <div className="w-80 bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-center mb-6">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src="/api/placeholder/80/80" />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mb-1">John Peterson</h2>
        <p className="text-gray-400 mb-4">Teacher</p>
        
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <Badge className="bg-purple-600 hover:bg-purple-700">Python</Badge>
          <Badge variant="secondary" className="bg-gray-700 hover:bg-gray-600">C++</Badge>
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
          <span className="text-white">14 October, 2023</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Teacher description</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          With a rich tapestry of 15 years in education, I am a seasoned teacher deeply immersed in the world of programming, with Python as my language of choice.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mt-2">
          My journey is woven with a passion for imparting knowledge, fostering curiosity, and molding the next generation of tech enthusiasts.
        </p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Hour rate</h3>
        <p className="text-gray-400">$24/h</p>
      </div>
      
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        Hire teacher
      </Button>
    </div>
  );
};