import React from 'react';
import { Home, UserPlus, BookOpen, Users, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
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
          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white border-b-2 border-purple-400">
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
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Avatar className="w-8 h-8">
          <AvatarImage src="/api/placeholder/32/32" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};