import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Components
import SearchWidget from './SearchWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/met_logo.jpg" 
                  alt="Met Museum Logo" 
                  width={35} 
                  height={35} 
                  className="rounded"
                  style={{ height: 'auto', width: 'auto' }}
                />
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Met Explorer</span>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-6">
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link 
                      href="/" 
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/pages/collection" 
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Browse
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/pages/search" 
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Search
                    </Link>
                  </li>
                </ul>
              </nav>
              <SearchWidget />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Data provided by the Metropolitan Museum of Art Collection API
          </p>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
            <a 
              href="https://metmuseum.github.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              API Documentation
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}