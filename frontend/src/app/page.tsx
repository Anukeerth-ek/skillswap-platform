import React from 'react';
// import { Navbar } from '../app/components/HomeSections/Header/Navbar.tsx';
import { SearchBar } from '../app/components/Searchbar';
import { LeftSidebar } from '../app/components/HomeSections/Filters';
import { SearchResults } from '../app/components/HomeSections/searchResult';
// import { ConnectionDetailSideBar } from '../app/components/HomeSections/connectionDetailPage';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Navbar /> */}
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1 flex flex-col">
          <div className="p-6">
            <SearchBar />
          </div>
          <div className="flex flex-1">
            <SearchResults />
            {/* <ConnectionDetailSideBar /> */}
          </div>
        </div>
      </div>
    </div>
  );
}