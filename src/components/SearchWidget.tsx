'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      router.push(`/pages/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Quick Search..."
          className="py-1 px-3 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white w-full"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}