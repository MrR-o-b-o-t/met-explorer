'use client';

// hooks
import { useState, useEffect, useMemo } from 'react';
import { metApi, fetcher } from '@/api/metApi';
import useSWR, { preload } from 'swr';

// components
import ArtworkCard from '@/components/ArtCard';
import MainLayout from "@/components/MainLayout";
import Pagination from '@/components/Pagination';
import SkeletonLoader from '@/components/SkeletonLoader';

const getArtworksKey = (page: number, ids: number[]) => 
  ids.length > 0 ? [`artworks-home-${page}`, ids] : null;

const fetchArtworks = async ([, ids]: [string, number[]]) => {
  const artworkPromises = ids.map(id => metApi.getObject(id));
  return Promise.all(artworkPromises);
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const objectsPerPage = 3;

  const { data: objectsData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL || 'https://collectionapi.metmuseum.org/public/collection/v1'}/objects`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const objectIds = useMemo(() => objectsData?.objectIDs || [], [objectsData]);
  const startIndex = (currentPage - 1) * objectsPerPage;
  const currentPageObjectIds = objectIds.slice(startIndex, startIndex + objectsPerPage);

  const nextPage = currentPage + 1;
  const nextPageStartIndex = (nextPage - 1) * objectsPerPage;
  const hasNextPage = nextPageStartIndex < objectIds.length;

  const { data: artworks, isLoading } = useSWR(
    getArtworksKey(currentPage, currentPageObjectIds),
    fetchArtworks,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  useEffect(() => {
    if (artworks && hasNextPage) {
      const nextPageObjectIds = hasNextPage 
        ? objectIds.slice(nextPageStartIndex, nextPageStartIndex + objectsPerPage) 
        : [];
        
      if (nextPageObjectIds.length > 0) {
        preload(getArtworksKey(nextPage, nextPageObjectIds), fetchArtworks);
      }
    }
  }, [artworks, hasNextPage, nextPage, nextPageStartIndex, objectIds, objectsPerPage]);

  const handlePageChange = (page: number) => {
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
      preload(getArtworksKey(futurePage, futurePageObjectIds), fetchArtworks);
    }
  };

  const loading = !objectsData || isLoading;

  return (
    <MainLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-4">
            Welcome to the Met Museum Collection Explorer
          </h1>
          <h2 className="text-base text-center sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
            Discover over 470,000 artworks spanning 5,000 years of world culture. You can navigate the collection in the following ways:
          </h2>
          <ul className="text-base text-center sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
            <li>Browse collections by department using the Browse tab</li>
            <li>Search for artwork by title or ID using the Search tab</li>
            <li>Use the Quick Search bar to search for artwork by name</li>
          </ul>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <SkeletonLoader type="card" count={objectsPerPage} className="h-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {artworks?.map(artwork => (
                  <ArtworkCard key={artwork.objectID} artwork={artwork} />
                ))}
              </div>
              
              {objectIds.length > objectsPerPage && (
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(objectIds.length / objectsPerPage)}
                    onPageChange={handlePageChange}
                    disabled={loading}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
            About the Metropolitan Museum of Art
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
  The Metropolitan Museum of Art presents over 5,000 years of art from around the world.
  The Museum lives in two iconic sites in New York City—The Met Fifth Avenue and The Met Cloisters.
  This application uses the Met Museum&apos;s Open Access API to provide access to the collection.
</p>
        </div>
      </div>
    </MainLayout>
  );
}
