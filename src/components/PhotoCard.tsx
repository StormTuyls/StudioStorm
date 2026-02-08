import { useState } from "react";
import { Link } from "react-router-dom";
import { likePhoto } from "../api";
import type { Photo } from "../types";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [likes, setLikes] = useState(photo.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

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
      console.error("Failed to like photo:", err);
      // Revert on error
      setIsLiked(wasLiked);
      setLikes(currentLikes);
    } finally {
      setTimeout(() => setIsProcessing(false), 300);
    }
  };

  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="relative overflow-hidden">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Featured badge */}
        {photo.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            ⭐ Featured
          </div>
        )}

        {/* Like button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isProcessing}
          className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-all duration-200 z-10 ${
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

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-medium mb-1">
              {photo.title}
            </h3>
            <p className="text-gray-200 text-sm">{photo.location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
