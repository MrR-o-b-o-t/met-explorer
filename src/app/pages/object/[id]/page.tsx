'use client';
import { useState, useEffect, Suspense, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Services
import { metApi } from '@/api/metApi';

// Components
import MainLayout from '@/components/MainLayout';

interface ObjectPageProps {
  params: Promise<{ id: string }>;
}

interface Artwork {
  objectID: number;
  title?: string;
  primaryImage?: string;
  artistDisplayName?: string;
  artistDisplayBio?: string;
  objectDate?: string;
  medium?: string;
  dimensions?: string;
  department?: string;
  culture?: string;
  creditLine?: string;
  objectURL?: string;
}

function ObjectContent({ id }: { id: string }) {
  const searchParams = new URLSearchParams(window.location.search);
  
  const deptParam = searchParams.get('dept');
  const pageParam = searchParams.get('page');
  
  const searchQuery = searchParams.get('q');
  const searchPage = searchParams.get('page');

  const backLinkParams = new URLSearchParams();

  let backLink = '/';
  let backText = 'Back to Home';
  
  if (deptParam) {
    backLinkParams.set('dept', deptParam);
    if (pageParam) {
      backLinkParams.set('page', pageParam);
    }
    backLink = `/pages/collection?${backLinkParams.toString()}`;
    backText = 'Back to Collection';
  } else if (searchQuery) {
    backLinkParams.set('q', searchQuery);
    if (searchPage) {
      backLinkParams.set('page', searchPage);
    }
    backLink = `/pages/search?${backLinkParams.toString()}`;
    backText = 'Back to Search Results';
  }
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const objectId = parseInt(id);
        if (isNaN(objectId)) {
          throw new Error('Invalid object ID');
        }
        
        const data = await metApi.getObject(objectId);
        
        if (!data || !data.objectID) {
          throw new Error('Artwork not found');
        }
        
        setArtwork(data);
      } catch (err) {
        setError('Error loading artwork. Please try again.');
        console.error('Error fetching artwork:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
          <Link 
            href={backLink}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            &larr; {backText}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (loading || !artwork) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href={backLink}
            className="inline-block mb-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            &larr; {backText}
          </Link>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 lg:w-2/5">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square animate-pulse"></div>
            </div>
            <div className="md:w-1/2 lg:w-3/5">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href={backLink}
          className="inline-block mb-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          &larr; {backText}
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 lg:w-2/5">
            {artwork.primaryImage ? (
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={artwork.primaryImage}
                  alt={artwork.title || 'Artwork image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                  No image available
                </p>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 lg:w-3/5">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {artwork.title || 'Untitled'}
            </h1>
            
            {artwork.artistDisplayName && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {artwork.artistDisplayName}
                {artwork.artistDisplayBio && ` (${artwork.artistDisplayBio})`}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {artwork.objectDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.objectDate}</p>
                </div>
              )}
              
              {artwork.medium && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Medium</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.medium}</p>
                </div>
              )}
              
              {artwork.dimensions && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dimensions</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.dimensions}</p>
                </div>
              )}
              
              {artwork.department && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.department}</p>
                </div>
              )}
              
              {artwork.culture && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Culture</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.culture}</p>
                </div>
              )}
              
              {artwork.creditLine && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{artwork.creditLine}</p>
                </div>
              )}
            </div>
            
            {artwork.objectURL && (
              <a 
                href={artwork.objectURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                View on Met Museum Website
              </a>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ObjectPage({ params }: ObjectPageProps) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  return (
    <Suspense fallback={<MainLayout><div className="p-8">Loading artwork details...</div></MainLayout>}>
      <ObjectContent id={id} />
    </Suspense>
  );
}