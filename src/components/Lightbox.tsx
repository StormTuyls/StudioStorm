import { useState, useEffect, useCallback } from "react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  title?: string;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  title,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goToPrevious, goToNext]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center overflow-hidden"
      onClick={(e) => {
        // Only close if clicking directly on the background, not on any child element
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/75 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-200 z-60 pointer-events-auto cursor-pointer font-bold text-2xl"
        aria-label="Close lightbox"
        style={{ pointerEvents: "auto" }}
      >
        ✕
      </button>

      {/* Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/75 transition z-60"
              aria-label="Previous image"
            >
              ←
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/75 transition z-60"
              aria-label="Next image"
            >
              →
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Info */}
      {title && (
        <div className="absolute top-4 left-4 text-white bg-black/50 px-4 py-2 rounded">
          {title}
        </div>
      )}
    </div>
  );
}
