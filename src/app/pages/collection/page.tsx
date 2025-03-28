'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams} from 'next/navigation';

// Services 
import useSWR, { preload } from 'swr';
import { metApi, fetcher } from '@/api/metApi';

// Components
import ArtworkCard from '@/components/ArtCard';
import Pagination from '@/components/Pagination';
import DepartmentFilter from '@/components/DepartmentFilter';
import MainLayout from '@/components/MainLayout';
import SkeletonLoader from '@/components/SkeletonLoader';

// helper function to generate key for artwork fetching
const getArtworksKey = (department: number | undefined, page: number, ids: number[]) => 
  ids.length > 0 ? [`artworks-${department}-${page}`, ids] : null;

// helper function to fetch artwork
const fetchArtworks = async ([, ids]: [string, number[]]) => {
  const artworkPromises = ids.map((id: number) => metApi.getObject(id));
  return Promise.all(artworkPromises);
};

function CollectionContent() {
  const searchParams = useSearchParams();

  const initialDepartment = searchParams.get('dept') ? Number(searchParams.get('dept')) : undefined;
  const initialPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  
  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>(initialDepartment);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const objectsPerPage = 4;

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedDepartment !== undefined) {
      params.set('dept', selectedDepartment.toString());
    }
    
    if (currentPage !== 1) {
      params.set('page', currentPage.toString());
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    window.history.replaceState({}, '', `/pages/collection${newUrl}`);
  }, [selectedDepartment, currentPage]);

  const { data: objectsData } = useSWR(
    selectedDepartment !== undefined 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'https://collectionapi.metmuseum.org/public/collection/v1'}/objects?departmentIds=${selectedDepartment}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'https://collectionapi.metmuseum.org/public/collection/v1'}/objects`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const objectIds = useMemo(() => 
    objectsData?.objectIDs || [],
    [objectsData]
  );
  const totalObjects = objectsData?.total || 0;

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
    getArtworksKey(selectedDepartment, currentPage, currentPageObjectIds),
    fetchArtworks,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
      keepPreviousData: true, 
    }
  );

  useEffect(() => {
    if (artworks && hasNextPage && nextPageObjectIds.length > 0) {
      preload(
        getArtworksKey(selectedDepartment, nextPage, nextPageObjectIds), 
        fetchArtworks
      );
    }
  }, [artworks, hasNextPage, nextPage, nextPageObjectIds, selectedDepartment]);

  const handleDepartmentChange = (departmentId: number | undefined) => {
    setSelectedDepartment(departmentId);
    setCurrentPage(1); 
  };

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
      preload(
        getArtworksKey(selectedDepartment, futurePage, futurePageObjectIds), 
        fetchArtworks
      );
    }
  };

  const loading = !objectsData || isLoading;

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <DepartmentFilter 
            selectedDepartment={selectedDepartment} 
            onDepartmentChange={handleDepartmentChange} 
          />
        </div>
        
        <div className="flex-1">
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            {loading ? (
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
            ) : (
              <span>Showing {artworks?.length || 0} of {totalObjects.toLocaleString()} objects</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array(objectsPerPage).fill(0).map((_, index) => (
                <div key={index}>
                  <SkeletonLoader type="card" />
                </div>
              ))
            ) : (
              artworks?.map(artwork => (
                <ArtworkCard key={artwork.objectID} artwork={artwork} />
              ))
            )}
          </div>
          
          {/* disable pagination during loading */}
          {objectIds.length > objectsPerPage && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(objectIds.length / objectsPerPage)}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<MainLayout><div className="p-8">Loading collection page...</div></MainLayout>}>
      <CollectionContent />
    </Suspense>
  );
}