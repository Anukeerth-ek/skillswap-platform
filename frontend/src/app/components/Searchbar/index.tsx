import React from 'react';
import { ChevronDown, Search} from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type SearchBarProps = {
  handleUserSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SearchBar = ({ handleUserSearch }: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search Skill Swap"
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          onChange={handleUserSearch}
        />
      </div>
      <Button variant="outline" className=" w-44 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 text-left">
        Code
        <ChevronDown className="w-36 h-4 ml-2" />
      </Button>
      <Button className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-16">
        Find Mate
      </Button>
    </div>
  );
};
