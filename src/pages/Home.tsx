import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFeaturedPhotos,
  getMainAlbums,
  getOrganizations,
  likePhoto,
} from "../api";
import type { Photo, Album, Organization } from "../types";

export default function Home() {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [mainAlbums, setMainAlbums] = useState<Album[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<
    Map<number, { isLiked: boolean; likes: number }>
  >(new Map());
  const [processingLikes, setProcessingLikes] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [photos, albums, orgs] = await Promise.all([
          getFeaturedPhotos(),
          getMainAlbums(),
          getOrganizations(),
        ]);
        setFeaturedPhotos(photos.slice(0, 6));
        setMainAlbums(albums);
        setOrganizations(orgs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLike = async (photoId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (processingLikes.has(photoId)) return;

    setProcessingLikes((prev) => new Set([...prev, photoId]));

    const currentState = likedPhotos.get(photoId);
    const wasLiked = currentState?.isLiked || false;
    const currentLikes =
      currentState?.likes ||
      featuredPhotos.find((p) => p.id === photoId)?.likes ||
      0;

    // Optimistic update
    setLikedPhotos((prev) =>
      new Map(prev).set(photoId, {
        isLiked: !wasLiked,
        likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
      }),
    );

    try {
      const result = await likePhoto(photoId);
      setLikedPhotos((prev) =>
        new Map(prev).set(photoId, {
          isLiked: result.isLiked,
          likes: result.likes,
        }),
      );
    } catch (err) {
      console.error("Failed to like photo:", err);
      // Revert on error
      setLikedPhotos((prev) =>
        new Map(prev).set(photoId, {
          isLiked: wasLiked,
          likes: currentLikes,
        }),
      );
    } finally {
      setTimeout(() => {
        setProcessingLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      }, 300);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-125 flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            STUDIO STORM
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Atletiekfotografie - vastleggen van snelheid, kracht en emotie
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/gallery"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Bekijk Gallery
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-gray-900 transition"
            >
              Neem Contact Op
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Onze Beste Werk
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            De meest geliefde momenten van sport en actiefotografie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredPhotos.length > 0 ? (
            featuredPhotos.map((photo) => {
              const photoState = likedPhotos.get(photo.id);
              const isLiked = photoState?.isLiked || false;
              const likes = photoState?.likes ?? photo.likes;
              const isProcessing = processingLikes.has(photo.id);

              return (
                <Link
                  key={photo.id}
                  to={`/photo/${photo.id}`}
                  className="group relative overflow-hidden rounded-lg aspect-4/3 bg-gray-200"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Like button */}
                  <button
                    type="button"
                    onClick={(e) => handleLike(photo.id, e)}
                    disabled={isProcessing}
                    className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all duration-200 z-20 ${
                      isProcessing
                        ? "opacity-50 cursor-wait"
                        : isLiked
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-red-100"
                    }`}
                    aria-label={isLiked ? "Unlike photo" : "Like photo"}
                  >
                    {isProcessing ? "⏳" : isLiked ? "❤️" : "🤍"} {likes}
                  </button>

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-medium mb-2">
                        {photo.title}
                      </h3>
                      <p className="text-gray-200 text-sm">{photo.location}</p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : loading ? (
            <p className="col-span-3 text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="col-span-3 text-center text-red-600">{error}</p>
          ) : null}
        </div>

        <div className="text-center">
          <Link
            to="/gallery"
            className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition"
          >
            Bekijk Alle Foto's
          </Link>
        </div>
      </section>

      {/* Albums Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Onze Albums
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ontdek onze collecties georganiseerd per sport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainAlbums.map((album) => {
              // Find cover photo from API data
              const coverPhoto = featuredPhotos.find(
                (p) => p.id === album.coverPhotoId,
              ) || {
                imageUrl:
                  "https://via.placeholder.com/800x600?text=" + album.name,
              };
              return (
                <Link
                  key={album.id}
                  to={`/albums/${album.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-3/4 bg-gray-200"
                >
                  <img
                    src={coverPhoto?.imageUrl}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-2xl font-medium mb-2">
                        {album.name}
                      </h3>
                      <p className="text-gray-200 text-sm mb-2">
                        {album.description}
                      </p>
                      <p className="text-gray-300 text-xs">
                        {album.photoCount} foto's
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners & Organisaties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4">
            Samenwerkingen
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trots om samen te werken met deze geweldige organisaties
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {org.website ? (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-600 transition"
                  >
                    {org.name}
                  </a>
                ) : (
                  org.name
                )}
              </h3>
              <p className="text-sm text-gray-600">{org.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-light mb-4">Volg Ons Op Instagram</h2>
          <p className="text-lg mb-6 text-white/90">
            Blijf op de hoogte van onze nieuwste werk en achter de schermen
            content
          </p>
          <a
            href="https://instagram.com/studiostorm.sports"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            @studiostorm.sports
          </a>
        </div>
      </section>
    </div>
  );
}
