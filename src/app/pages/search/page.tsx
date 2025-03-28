'use client';
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR, { preload } from 'swr';

// services
import { metApi } from '@/api/metApi';

// components
import ArtworkCard from '@/components/ArtCard';
import Pagination from '@/components/Pagination';
import MainLayout from '@/components/MainLayout';
import SkeletonLoader from '@/components/SkeletonLoader';

const getArtworksKey = (ids: number[]) => 
  ids.length > 0 ? ['search-artworks', ids] : null;

const fetchArtworks = async ([, ids]: [string, number[]]) => {
  const artworkPromises = ids.map(id => metApi.getObject(id));
  return Promise.all(artworkPromises);
};

function SearchContent() {
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const initialSearchType = (searchParams.get('type') as 'id' | 'title') || 'title';
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'id' | 'title'>(initialSearchType);
  const [searchLoading, setSearchLoading] = useState(false);
  const [objectIds, setObjectIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const objectsPerPage = 4;

  const performSearch = useCallback(async (query: string, resetPage = false) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setSearchLoading(true);
    setError(null);
    
    try {
      if (searchType === 'id') {
        const objectId = parseInt(query);
        if (isNaN(objectId)) {
          setError('Please enter a valid numeric ID');
          return;
        }
        
        try {
          const artwork = await metApi.getObject(objectId);
          setObjectIds([artwork.objectID]);
          setTotalResults(1);
          if (resetPage) {
            setCurrentPage(1);
          }
        } catch (err) {
          setObjectIds([]);
          setTotalResults(0);
          setError(`No artwork found with ID ${objectId}`);
          console.error('Error fetching artwork by ID:', err);
        }
      } else {
        const response = await metApi.searchObjects(query, { title: true });
        setObjectIds(response.objectIDs || []);
        setTotalResults(response.total);
        
        if (!response.objectIDs || response.objectIDs.length === 0) {
          setError(`No results found for "${query}"`);
        }
        if (resetPage) {
          setCurrentPage(1);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setObjectIds([]);
      setTotalResults(0);
    } finally {
      setSearchLoading(false);
    }
  }, [searchType, setSearchLoading, setError, setObjectIds, setTotalResults, setCurrentPage]);

  useEffect(() => {
    if (searchQuery && objectIds.length > 0) {
      const params = new URLSearchParams();
      
      params.set('q', searchQuery);
      
      if (searchType !== 'title') {
        params.set('type', searchType);
      }
      
      if (currentPage !== 1) {
        params.set('page', currentPage.toString());
      }
      
      const newUrl = `?${params.toString()}`;
      window.history.replaceState({}, '', `/pages/search${newUrl}`);
    }
  }, [searchType, currentPage, objectIds.length, searchQuery]);

  const startIndex = (currentPage - 1) * objectsPerPage;
  const currentPageObjectIds = objectIds.slice(startIndex, startIndex + objectsPerPage);
  
  const nextPage = currentPage + 1;
  const nextPageStartIndex = (nextPage - 1) * objectsPerPage;
  const hasNextPage = nextPageStartIndex < objectIds.length;
  const nextPageObjectIds = useMemo(() => 
    hasNextPage ? objectIds.slice(nextPageStartIndex, nextPageStartIndex + objectsPerPage) : [],
    [hasNextPage, objectIds, nextPageStartIndex, objectsPerPage]
  );

  const { data: artworks, isLoading } = useSWR(
    getArtworksKey(currentPageObjectIds),
    fetchArtworks,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (artworks && hasNextPage && nextPageObjectIds.length > 0) {
      preload(getArtworksKey(nextPageObjectIds), fetchArtworks);
    }
  }, [artworks, hasNextPage, nextPageObjectIds]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, false);
    }
  }, [initialQuery, performSearch]); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, true);
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || objectIds.length === 0) return;
    
    setCurrentPage(page);
    window.scrollTo(0, 0);
    
    const futurePage = page + 1;
    const futurePageStartIndex = (futurePage - 1) * objectsPerPage;
    const hasFuturePage = futurePageStartIndex < objectIds.length;
    
    if (hasFuturePage) {
      const futurePageObjectIds = objectIds.slice(
        futurePageStartIndex, 
        futurePageStartIndex + objectsPerPage
      );
      preload(getArtworksKey(futurePageObjectIds), fetchArtworks);
    }
  };

  const isPageLoading = isLoading || searchLoading;

  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Term
              </label>
              <input
                type="text"
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md"
                placeholder={searchType === 'id' ? 'Enter artwork ID' : 'Enter artwork title'}
              />
            </div>
            <div className="mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="search-type"
                    checked={searchType === 'title'}
                    onChange={() => setSearchType('title')}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Title</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="search-type"
                    checked={searchType === 'id'}
                    onChange={() => setSearchType('id')}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Object ID</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={searchLoading}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md mb-6">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {isPageLoading ? (
        <div className="space-y-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={objectsPerPage} />
          </div>
        </div>
      ) : artworks && artworks.length > 0 ? (
        <>
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            Showing {artworks.length} of {totalResults.toLocaleString()} results
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork.objectID} artwork={artwork} />
            ))}
          </div>
          
          {objectIds.length > objectsPerPage && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(objectIds.length / objectsPerPage)}
                onPageChange={handlePageChange}
                disabled={isPageLoading}
              />
            </div>
          )}
        </>
      ) : searchQuery && !isPageLoading && !error ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No results found for {searchQuery}</p>
        </div>
      ) : null}
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<MainLayout><div className="p-8">Loading search page...</div></MainLayout>}>
      <SearchContent />
    </Suspense>
  );
}