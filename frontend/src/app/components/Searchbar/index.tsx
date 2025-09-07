import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SearchBar = ({handleUserSearch}:any) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Python"
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          onChange={handleUserSearch}
        />
      </div>
      {/* <Button variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
        Code
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button> */}
      <Button className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8">
        Search
      </Button>
    </div>
  );
};