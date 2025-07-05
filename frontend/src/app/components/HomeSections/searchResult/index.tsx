import React from 'react';
import { ConnectionCard } from '../connectionCard/index';

const teachers = [
  {
    name: "John Peterson",
    role: "Teacher",
    avatar: "/api/placeholder/48/48",
    hourRate: 24,
    experience: "15 years of experience",
    skills: ["Python", "C++"],
    isBookmarked: true
  },
  {
    name: "Elevan Georgi",
    role: "Teacher",
    avatar: "/api/placeholder/48/48",
    hourRate: 19,
    experience: "6 years of experience",
    skills: ["Python", "JavaScript"],
    isBookmarked: true
  },
  {
    name: "Jeff Sinister",
    role: "Consultant",
    avatar: "/api/placeholder/48/48",
    hourRate: 14,
    experience: "4 years of experience",
    skills: ["Python", "Swift"]
  },
  {
    name: "Alex Morning",
    role: "Teacher",
    avatar: "/api/placeholder/48/48",
    hourRate: 22,
    experience: "8 years of experience",
    skills: ["Python", "Java"]
  },
  {
    name: "Andrew Maclaren",
    role: "Lector",
    avatar: "/api/placeholder/48/48",
    hourRate: 34,
    experience: "26 years of experience",
    skills: ["Python", "Ruby"]
  }
];

export const SearchResults = () => {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Search Results</h2>
        <span className="text-gray-400">30000 results found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((teacher, index) => (
          <ConnectionCard key={index} {...teacher} />
        ))}
      </div>
    </div>
  );
};