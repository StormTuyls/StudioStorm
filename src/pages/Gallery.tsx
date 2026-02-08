import { useEffect, useState } from 'react';
import PhotoGrid from '../components/PhotoGrid';
import { getPhotos, getAlbums } from '../api';
import type { Photo, Album } from '../types';

type FilterType = 'all' | 'featured' | 'atletiek' | 'volleybal' | 'jiu-jitsu';
type SortType = 'mostLiked' | 'newest';

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('mostLiked');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [allPhotos, albums] = await Promise.all([
          getPhotos(),
          getAlbums(), // Changed from getMainAlbums() to getAlbums() to get all albums including subalbums
        ]);
        setPhotos(allPhotos);
        setAllAlbums(albums);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter foto's
  let filteredPhotos = photos;
  
  if (filter === 'featured') {
    filteredPhotos = photos.filter(p => p.isFeatured);
  } else if (filter === 'atletiek') {
    const atletiekAlbumIds = allAlbums
      .filter(a => a.id === 1 || a.parentId === 1)
      .map(a => a.id);
    filteredPhotos = photos.filter(p => atletiekAlbumIds.includes(p.albumId));
  } else if (filter === 'volleybal') {
    const volleybalAlbumIds = allAlbums
      .filter(a => a.id === 2 || a.parentId === 2)
      .map(a => a.id);
    filteredPhotos = photos.filter(p => volleybalAlbumIds.includes(p.albumId));
  } else if (filter === 'jiu-jitsu') {
    filteredPhotos = photos.filter(p => p.albumId === 3);
  }

  // Sorteer foto's
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sort === 'mostLiked') {
      return b.likes - a.likes;
    } else {
      return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime();
    }
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Alles' },
    { key: 'featured', label: 'Beste Werk' },
    { key: 'atletiek', label: 'Atletiek' },
    { key: 'volleybal', label: 'Volleybal' },
    { key: 'jiu-jitsu', label: 'Jiu-Jitsu' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Gallery</h1>
        <p className="text-gray-600">Loading photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Gallery</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Gallery</h1>
        <p className="text-gray-600 max-w-2xl">
          Studio Storm legt de meest intense en dynamische momenten van sport vast.
          Met een focus op atletiek, maar ook volleybal en jiu-jitsu - ontdek de 
          passie en actie van sport.
        </p>
      </div>

      {/* Filters en Sortering */}
      <div className="mb-8 space-y-4">
        {/* Filter knoppen */}
        <div className="flex flex-wrap gap-3">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sorteer en count */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>{sortedPhotos.length} foto's</span>
          <div className="flex items-center gap-2">
            <span>Sorteer:</span>
            <button
              onClick={() => setSort('mostLiked')}
              className={`px-3 py-1 rounded ${
                sort === 'mostLiked'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ❤️ Meest geliefd
            </button>
            <button
              onClick={() => setSort('newest')}
              className={`px-3 py-1 rounded ${
                sort === 'newest'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🕒 Nieuwste
            </button>
          </div>
        </div>
      </div>
      
      <PhotoGrid photos={sortedPhotos} />
    </div>
  );
}
