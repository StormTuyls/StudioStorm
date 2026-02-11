import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getClientGalleryByUrl, likeGalleryPhoto, verifyGalleryPassword } from "../api";
import Lightbox from "../components/Lightbox";

interface ClientGalleryPhoto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  uploadedAt: string;
  likes?: number;
}

interface ClientGallery {
  id: number;
  clientName: string;
  description: string;
  photos: ClientGalleryPhoto[];
  createdAt: string;
  isProtected?: boolean;
  allowDownload?: boolean;
}

export default function ClientGalleryView() {
  const { uniqueUrl } = useParams<{ uniqueUrl: string }>();
  const [gallery, setGallery] = useState<ClientGallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [processingLikes, setProcessingLikes] = useState<Set<number>>(
    new Set(),
  );
  
  // Password protection
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authenticatedPassword, setAuthenticatedPassword] = useState<string | null>(null);

  // Load liked photos from localStorage on mount
  useEffect(() => {
    if (!uniqueUrl) return;
    const storageKey = `liked_photos_${uniqueUrl}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLikedPhotos(new Set(parsed));
      } catch {
        console.error("Failed to parse liked photos from localStorage");
      }
    }
  }, [uniqueUrl]);

  // Initial gallery load
  useEffect(() => {
    const loadGallery = async () => {
      if (!uniqueUrl) return;
      try {
        const data = await getClientGalleryByUrl(uniqueUrl, authenticatedPassword || undefined);
        setGallery(data);
        setNeedsPassword(false);
      } catch (err: any) {
        if (err.message.includes("Password required") || err.message.includes("requiresAuth")) {
          setNeedsPassword(true);
          setLoading(false);
        } else {
          setError("Gallery not found or has expired");
          setLoading(false);
        }
      } finally {
        if (!needsPassword) {
          setLoading(false);
        }
      }
    };

    loadGallery();
  }, [uniqueUrl, authenticatedPassword]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    try {
      const result = await verifyGalleryPassword(uniqueUrl!, password);
      if (result.valid) {
        setAuthenticatedPassword(password);
        setNeedsPassword(false);
        setLoading(true);
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (err) {
      setPasswordError("Failed to verify password");
    }
  };

  // Poll for updates every 5 seconds (only when not processing likes and authenticated)
  useEffect(() => {
    if (!uniqueUrl || lightboxOpen || needsPassword) return;

    const pollInterval = setInterval(async () => {
      // Don't poll if any likes are being processed
      if (processingLikes.size > 0) return;

      try {
        const data = await getClientGalleryByUrl(uniqueUrl, authenticatedPassword || undefined);
        setGallery(data);
      } catch {
        console.error("Failed to poll gallery updates");
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [uniqueUrl, lightboxOpen, processingLikes.size, needsPassword, authenticatedPassword]);

  const handleLike = async (photoId: number) => {
    if (!uniqueUrl || processingLikes.has(photoId)) {
      console.log("Like blocked - processing or no URL");
      return;
    }

    console.log("Handling like for photo:", photoId);

    // Mark as processing
    setProcessingLikes((prev) => new Set([...prev, photoId]));

    const isCurrentlyLiked = likedPhotos.has(photoId);
    const currentPhoto = gallery?.photos.find((p) => p.id === photoId);
    const currentLikes = currentPhoto?.likes || 0;

    console.log("Current state:", { isCurrentlyLiked, currentLikes });

    // Optimistic update: toggle liked state and update count
    const newIsLiked = !isCurrentlyLiked;
    const newLikes = newIsLiked
      ? currentLikes + 1
      : Math.max(0, currentLikes - 1);

    // Update UI immediately
    setLikedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newIsLiked) {
        newSet.add(photoId);
      } else {
        newSet.delete(photoId);
      }
      return newSet;
    });

    setGallery((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        photos: prev.photos.map((p) =>
          p.id === photoId ? { ...p, likes: newLikes } : p,
        ),
      };
    });

    // Update localStorage
    const storageKey = `liked_photos_${uniqueUrl}`;
    const newLikedSet = new Set(likedPhotos);
    if (newIsLiked) {
      newLikedSet.add(photoId);
    } else {
      newLikedSet.delete(photoId);
    }
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newLikedSet)));

    try {
      // Send to server
      const result = await likeGalleryPhoto(uniqueUrl, photoId);

      // Update with server response
      setGallery((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          photos: prev.photos.map((p) =>
            p.id === photoId ? { ...p, likes: result.likes } : p,
          ),
        };
      });

      // Sync liked state with server
      setLikedPhotos((prev) => {
        const newSet = new Set(prev);
        if (result.isLiked) {
          newSet.add(photoId);
        } else {
          newSet.delete(photoId);
        }
        return newSet;
      });

      // Update localStorage with confirmed state
      const confirmedSet = new Set(likedPhotos);
      if (result.isLiked) {
        confirmedSet.add(photoId);
      } else {
        confirmedSet.delete(photoId);
      }
      localStorage.setItem(
        storageKey,
        JSON.stringify(Array.from(confirmedSet)),
      );
    } catch (err) {
      console.error("Failed to like/unlike photo:", err);

      // Revert optimistic update on error
      setLikedPhotos((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(photoId);
        } else {
          newSet.delete(photoId);
        }
        return newSet;
      });

      setGallery((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          photos: prev.photos.map((p) =>
            p.id === photoId ? { ...p, likes: currentLikes } : p,
          ),
        };
      });

      // Revert localStorage
      const revertedSet = new Set(likedPhotos);
      if (isCurrentlyLiked) {
        revertedSet.add(photoId);
      } else {
        revertedSet.delete(photoId);
      }
      localStorage.setItem(storageKey, JSON.stringify(Array.from(revertedSet)));
    } finally {
      // Remove from processing after a short delay
      setTimeout(() => {
        setProcessingLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(photoId);
          return newSet;
        });
      }, 300);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Password prompt
  if (needsPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Protected Gallery
              </h2>
              <p className="text-gray-600 text-sm">
                This gallery is password protected. Please enter the password to continue.
              </p>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Enter password"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Access Gallery
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Have a Studio Storm account?
              </p>
              <Link
                to="/client/login"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Sign in for automatic access
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Gallery not found"}</p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            {gallery.clientName}
          </h1>
          {gallery.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              {gallery.description}
            </p>
          )}
          <p className="text-sm text-gray-500">
            {gallery.photos.length} photos · Created on{" "}
            {new Date(gallery.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Photos Grid */}
        {gallery.photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.photos.map((photo, idx) => (
                <article
                  key={photo.id}
                  className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Image Container - Clickable */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openLightbox(idx)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        openLightbox(idx);
                      }
                    }}
                    className="relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium mb-2">View larger</p>
                        <span className="text-2xl">🔍</span>
                      </div>
                    </div>

                    {/* Like counter in top left corner */}
                    <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-1 shadow-md">
                      <span>❤️</span>
                      <span>{photo.likes || 0}</span>
                    </div>
                  </div>

                  {/* Info Section */}
                  {(photo.title || photo.description) && (
                    <div className="p-4">
                      {photo.title && (
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">
                          {photo.title}
                        </h3>
                      )}
                      {photo.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(photo.uploadedAt).toLocaleDateString()}
                        </p>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleLike(photo.id);
                              return false;
                            }}
                            disabled={processingLikes.has(photo.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 select-none ${
                              processingLikes.has(photo.id)
                                ? "opacity-50 cursor-wait"
                                : likedPhotos.has(photo.id)
                                  ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                  : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600 cursor-pointer"
                            }`}
                            style={{ WebkitTapHighlightColor: "transparent" }}
                            aria-label={
                              likedPhotos.has(photo.id)
                                ? "Unlike photo"
                                : "Like photo"
                            }
                          >
                            {processingLikes.has(photo.id)
                              ? "⏳"
                              : likedPhotos.has(photo.id)
                                ? "❤️ Liked"
                                : "🤍 Like"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
              <Lightbox
                images={gallery.photos.map((p) => p.imageUrl)}
                initialIndex={lightboxIndex}
                title={gallery.photos[lightboxIndex]?.title}
                onClose={() => setLightboxOpen(false)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No photos in this gallery yet.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p>
            Powered by{" "}
            <span className="text-gray-900 font-medium">Studio Storm</span>
          </p>
        </div>
      </div>
    </div>
  );
}
