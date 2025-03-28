// hooks
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Services
import { ArtObject } from '@/api/metApi';

interface ArtCardProps {
  artwork: ArtObject;
}

export default function ArtCard({ artwork }: ArtCardProps) {
  const searchParams = useSearchParams();
  
  const currentDept = searchParams.get('dept');
  const currentPage = searchParams.get('page');
  const searchQuery = searchParams.get('q');
  const searchType = searchParams.get('type');
  
  const queryParams = [];
  
  if (searchQuery) {
    queryParams.push(`q=${encodeURIComponent(searchQuery)}`);
    if (searchType) {
      queryParams.push(`type=${searchType}`);
    }
  } else if (currentDept) {
    queryParams.push(`dept=${currentDept}`);
  }
  
  if (currentPage) {
    queryParams.push(`page=${currentPage}`);
  }
  
  const objectUrl = `/pages/object/${artwork.objectID}${
    queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
  }`;
  
  return (
    <Link href={objectUrl}>
      <div className="bg-white min-w-54 dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
          {artwork.primaryImageSmall ? (
            <Image
              src={artwork.primaryImageSmall}
              alt={artwork.title}
              layout="fill"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No Image Available
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
            {artwork.artistDisplayName || 'Unknown Artist'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {artwork.objectDate}
          </p>
        </div>
      </div>
    </Link>
  );
}