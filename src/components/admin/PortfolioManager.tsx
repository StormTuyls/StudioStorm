import { useState, useEffect } from "react";
import type { PortfolioItem, Photo } from "../../types";

// TODO: Wire to actual API endpoints
export default function PortfolioManager() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState<
    "athletics" | "volleyball" | "jiu-jitsu"
  >("athletics");

  useEffect(() => {
    // TODO: Fetch portfolio items and available photos
    setIsLoading(true);
    // Placeholder - will be replaced with API call
    setIsLoading(false);
  }, []);

  const handleAddPhoto = (photo: Photo) => {
    // TODO: Add photo to portfolio
    console.log("Adding photo to portfolio:", photo);
  };

  const handleRemove = (itemId: string) => {
    // TODO: Delete from portfolio
    console.log("Removing portfolio item:", itemId);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    // TODO: Update order in API
    console.log("Reordering from", fromIndex, "to", toIndex);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading portfolio...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sport Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(["athletics", "volleyball", "jiu-jitsu"] as const).map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            className={`px-4 py-2 border-b-2 capitalize font-medium text-sm transition ${
              selectedSport === sport
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Current Portfolio for Sport */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4 capitalize">
          {selectedSport} Portfolio
        </h2>
        <div className="space-y-2">
          {portfolioItems
            .filter((item) => item.sport === selectedSport)
            .map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-center hover:shadow-md transition"
              >
                {/* Drag Handle */}
                <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                  ☰
                </div>

                {/* Preview */}
                {item.photo && (
                  <img
                    src={item.photo.imageUrl}
                    alt={item.photo.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.photo?.title}
                  </h3>
                  {item.caption && (
                    <p className="text-sm text-gray-500 mt-1">{item.caption}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1 border rounded hover:bg-gray-50">
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(item.id!)}
                    className="text-sm px-3 py-1 border border-red-200 text-red-700 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
        {portfolioItems.filter((item) => item.sport === selectedSport)
          .length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No images selected for {selectedSport} portfolio yet.
          </p>
        )}
      </div>

      {/* Add Photos from Events */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4">Add Photos</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select images from recent events to feature in your portfolio.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availablePhotos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => handleAddPhoto(photo)}
              className="group relative rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full aspect-square object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <p className="text-white font-medium text-sm text-center px-2">
                  {photo.title}
                </p>
              </div>
              <div className="absolute bottom-2 right-2 bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                +
              </div>
            </button>
          ))}
        </div>

        {availablePhotos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No photos available. Upload images to events first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
