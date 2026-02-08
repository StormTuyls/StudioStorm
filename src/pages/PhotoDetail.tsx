import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPhotoById, likePhoto } from "../api";
import type { Photo } from "../types";

export default function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No photo ID provided");
        const fetchedPhoto = await getPhotoById(Number(id));
        if (!fetchedPhoto) {
          setError("Foto niet gevonden");
        } else {
          setPhoto(fetchedPhoto);
          setLikes(fetchedPhoto.likes);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load photo");
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [id]);

  const handleLike = async () => {
    if (!photo || isProcessing) return;

    setIsProcessing(true);
    const wasLiked = isLiked;
    const currentLikes = likes;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikes(wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1);

    try {
      const result = await likePhoto(photo.id);
      setLikes(result.likes);
      setIsLiked(result.isLiked);
    } catch (err) {
      console.error("Failed to like/unlike photo:", err);
      // Revert on error
      setIsLiked(wasLiked);
      setLikes(currentLikes);
    } finally {
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600">Loading photo...</p>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-600">{error || "Foto niet gevonden"}</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Terug naar Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
      >
        <span>←</span> Terug
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photo */}
        <div className="lg:col-span-2">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-light text-gray-900">
                {photo.title}
              </h1>
            </div>
            <p className="text-gray-600">{photo.description}</p>
          </div>

          {/* Likes */}
          <div>
            <button
              onClick={handleLike}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-2 ${
                isProcessing
                  ? "opacity-50 cursor-wait bg-gray-100 text-gray-700"
                  : isLiked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"
              }`}
            >
              <span className="text-xl">
                {isProcessing ? "⏳" : isLiked ? "❤️" : "🤍"}
              </span>
              <span>
                {isLiked ? "Liked" : "Like"} · {likes}
              </span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Datum
                </dt>
                <dd className="text-sm text-gray-900">
                  {new Date(photo.dateTaken).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Locatie
                </dt>
                <dd className="text-sm text-gray-900">{photo.location}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Camera Instellingen
            </h2>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Camera
                </dt>
                <dd className="text-sm text-gray-900">
                  {photo.camera.make && photo.camera.make !== "Unknown"
                    ? `${photo.camera.make} ${photo.camera.model}`
                    : photo.camera.model}
                </dd>
              </div>
              {photo.lens && photo.lens !== "Unknown" && (
                <div>
                  <dt className="text-xs text-gray-500 uppercase tracking-wide">
                    Lens
                  </dt>
                  <dd className="text-sm text-gray-900">{photo.lens}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  ISO
                </dt>
                <dd className="text-sm text-gray-900">
                  {photo.iso || photo.camera.iso}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Aperture
                </dt>
                <dd className="text-sm text-gray-900">
                  {photo.aperture || photo.camera.aperture}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Sluitertijd
                </dt>
                <dd className="text-sm text-gray-900">
                  {photo.shutterSpeed || photo.camera.shutterSpeed}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-gray-500 uppercase tracking-wide">
                  Brandpunt
                </dt>
                <dd className="text-sm text-gray-900">
                  {photo.focalLength || photo.camera.focalLength}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
