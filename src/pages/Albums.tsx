import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMainAlbums, getPhotos } from '../api';
import type { Album, Photo } from '../types';

export default function Albums() {
  const [mainAlbums, setMainAlbums] = useState<Album[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [albums, photos] = await Promise.all([
          getMainAlbums(),
          getPhotos(),
        ]);
        setMainAlbums(albums);
        setAllPhotos(photos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load albums');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Albums</h1>
        <p className="text-gray-600">Loading albums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Albums</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Albums</h1>
        <p className="text-gray-600 max-w-2xl">
          Ontdek onze collecties georganiseerd per sport
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mainAlbums.map((album) => {
          const coverPhoto = allPhotos.find(p => p.id === album.coverPhotoId);
          const totalPhotos = allPhotos.filter(p => p.albumId === album.id).length;
          
          return (
            <Link
              key={album.id}
              to={`/albums/${album.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg aspect-4/3 mb-4 bg-gray-200">
                <img
                  src={coverPhoto?.imageUrl || 'https://via.placeholder.com/800x600?text=' + album.name}
                  alt={album.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-2 group-hover:text-gray-600 transition">
                {album.name}
              </h2>
              <p className="text-gray-600 mb-2">{album.description}</p>
              <p className="text-sm text-gray-500">{totalPhotos} foto's</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
