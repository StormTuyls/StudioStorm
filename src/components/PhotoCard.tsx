import { Link } from "react-router-dom";
import type { Photo } from "../types";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
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
