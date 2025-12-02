import React, { useState } from "react";
import {Search, Sparkles } from "lucide-react";
// import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type SearchBarProps = {
  handleUserSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  smartSearch: (prompt: string) => void;
};

export const SearchBar = ({ handleUserSearch, smartSearch  }: SearchBarProps) => {
     const [open, setOpen] = useState(false);
     const [input, setInput] = useState("");

     const handleSearch = () => {
       console.log("Searching for:", input);
        smartSearch(input); 
          setOpen(false);
     };
     return (
          <>
               <div className="flex items-center space-x-4 mb-6">
                    <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                         <Input
                              placeholder="Search Skill Swap"
                              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                              onChange={handleUserSearch}
                         />
                    </div>
                    <Button
                         variant="outline"
                         className=" bg-gray-800 border-gray-700 text-white hover:bg-gray-700 text-left"
                    >
                         Find Mate
                         {/* <ChevronDown className="w-36 h-4 ml-2" /> */}
                    </Button>
                    <Button onClick={() => setOpen(true)} className=" w-52 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-16">
                         Use Smart Search
                         <Sparkles />
                    </Button>
               </div>

               <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-md rounded-2xl">
                         <DialogHeader>
                              <DialogTitle className="text-xl font-semibold text-center">
                                   Welcome to Swapper Smart Search
                              </DialogTitle>
                              <DialogDescription className="text-center mt-2 text-base">
                                   Please write the prompt here to do the search 👇
                              </DialogDescription>
                         </DialogHeader>

                         {/* Textarea */}
                         <Textarea
                              placeholder="Type your query..."
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="mt-4 min-h-[120px] resize-none"
                         />

                         {/* Search Button */}
                         <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700" onClick={handleSearch}>
                              Search
                         </Button>
                    </DialogContent>
               </Dialog>
          </>
     );
};
