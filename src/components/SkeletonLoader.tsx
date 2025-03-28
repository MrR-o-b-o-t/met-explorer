import React from 'react';

interface SkeletonProps {
  type: 'card' | 'detail' | 'text' | 'image';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ type, count = 1, className = '' }: SkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white min-w-54 dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
            <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Image Loading...
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate animate-pulse">
                Loading...
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 animate-pulse">
                Loading Artist...
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 animate-pulse">
                Loading Date...
              </p>
            </div>
          </div>
        );
      
      case 'detail':
        return (
          <div className={`space-y-6 ${className}`}>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
          </div>
        );
      
      case 'image':
        return (
          <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}