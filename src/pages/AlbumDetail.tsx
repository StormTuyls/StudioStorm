import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAlbumBySlug, getPhotosByAlbumId, getSubalbums, getPhotos } from '../api';
import PhotoGrid from '../components/PhotoGrid';
import type { Album, Photo } from '../types';

export default function AlbumDetail() {
  const location = useLocation();
  // Extract slug from path like /albums/atletiek or /albums/atletiek/bk-veldlopen-2025
  const slug = location.pathname.replace('/albums/', '');
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [subAlbums, setSubAlbums] = useState<Album[]>([]);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!slug) throw new Error('No album slug provided');
        
        const fetchedAlbum = await getAlbumBySlug(slug);
        if (!fetchedAlbum) {
          setError('Album niet gevonden');
          return;
        }
        
        const [albumPhotos, subAlbumsList, allPhotosList] = await Promise.all([
          getPhotosByAlbumId(fetchedAlbum.id),
          getSubalbums(fetchedAlbum.id),
          getPhotos(),
        ]);
        
        setAlbum(fetchedAlbum);
        setPhotos(albumPhotos);
        setSubAlbums(subAlbumsList);
        setAllPhotos(allPhotosList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load album');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600">Loading album...</p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-600">{error || 'Album niet gevonden'}</p>
        <Link to="/albums" className="text-blue-600 hover:text-blue-800">
          Terug naar Albums
        </Link>
      </div>
    );
  }

  const isMainAlbum = !album.parentId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/albums"
        className="mb-6 text-gray-600 hover:text-gray-900 transition inline-flex items-center gap-2"
      >
        <span>←</span> Terug naar Albums
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-4">{album.name}</h1>
        <p className="text-gray-600 max-w-2xl">{album.description}</p>
      </div>

      {/* Als het een hoofdalbum is met subalbums, toon de subalbums */}
      {isMainAlbum && subAlbums.length > 0 ? (
        <div>
          <h2 className="text-2xl font-light text-gray-900 mb-6">Wedstrijden & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subAlbums.map((subAlbum) => {
              const coverPhoto = allPhotos.find(p => p.id === subAlbum.coverPhotoId);
              const photoCount = allPhotos.filter(p => p.albumId === subAlbum.id).length;
              return (
                <Link
                  key={subAlbum.id}
                  to={`/albums/${subAlbum.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-4/3 mb-4 bg-gray-200">
                    <img
                      src={coverPhoto?.imageUrl || 'https://via.placeholder.com/800x600?text=' + subAlbum.name}
                      alt={subAlbum.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition">
                    {subAlbum.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{subAlbum.description}</p>
                  <p className="text-xs text-gray-500">{photoCount} foto's</p>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        /* Anders toon de foto's */
        <>
          <p className="text-sm text-gray-500 mb-6">{photos.length} foto's</p>
          <PhotoGrid photos={photos} />
        </>
      )}
    </div>
  );
}
