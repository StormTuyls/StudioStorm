import { useState, useEffect, useMemo } from "react";
import {
  addToPortfolio,
  getPhotos,
  getPortfolio,
  getSports,
  removeFromPortfolio,
  updatePortfolioItem,
} from "../../api";
import type { PortfolioItem, Photo, Sport } from "../../types";

const fallbackSports: Sport[] = [
  { id: 1, title: "Atletiek", slug: "atletiek" },
  { id: 2, title: "Volleybal", slug: "volleybal" },
  { id: 3, title: "Jiu-Jitsu", slug: "jiu-jitsu" },
];

const normalizePortfolioSport = (value: string) => {
  if (value === "athletics") return "atletiek";
  if (value === "volleyball") return "volleybal";
  return value;
};
export default function PortfolioManager() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [availablePhotos, setAvailablePhotos] = useState<Photo[]>([]);
  const [sports, setSports] = useState<Sport[]>(fallbackSports);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState("atletiek");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editCaption, setEditCaption] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [portfolioData, photosData, sportsData] = await Promise.all([
          getPortfolio(),
          getPhotos(),
          getSports(),
        ]);
        setPortfolioItems(portfolioData);
        setAvailablePhotos(photosData);
        if (sportsData.length > 0) {
          setSports(sportsData);
          setSelectedSport(sportsData[0].slug);
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load portfolio",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, []);

  const photosById = useMemo(() => {
    const map = new Map<string, Photo>();
    availablePhotos.forEach((photo) => {
      if (photo.id) {
        map.set(String(photo.id), photo);
      }
    });
    return map;
  }, [availablePhotos]);

  const handleAddPhoto = async (photo: Photo) => {
    if (!photo.id) return;
    setError(null);

    try {
      const created = await addToPortfolio({
        photoId: String(photo.id),
        sport: selectedSport,
      });
      setPortfolioItems((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add photo");
    }
  };

  const handleRemove = async (itemId: string | undefined) => {
    if (!itemId) return;
    setError(null);

    try {
      await removeFromPortfolio(itemId);
      setPortfolioItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove portfolio item",
      );
    }
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setEditCaption(item.caption || "");
  };

  const handleSaveEdit = async () => {
    if (!editingItem?.id) return;
    setError(null);

    try {
      const updated = await updatePortfolioItem(editingItem.id, {
        caption: editCaption.trim(),
      });
      setPortfolioItems((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updated : item)),
      );
      setEditingItem(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update portfolio item",
      );
    }
  };

  const handleToggleFeatured = async (item: PortfolioItem) => {
    if (!item.id) return;
    setError(null);

    try {
      const updated = await updatePortfolioItem(item.id, {
        isFeatured: !item.isFeatured,
      });
      setPortfolioItems((prev) =>
        prev.map((prevItem) => (prevItem.id === item.id ? updated : prevItem)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update portfolio item",
      );
    }
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
        {sports.map((sport) => (
          <button
            key={sport.slug}
            onClick={() => setSelectedSport(sport.slug)}
            className={`px-4 py-2 border-b-2 capitalize font-medium text-sm transition ${
              selectedSport === sport.slug
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {sport.title}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Current Portfolio for Sport */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4 capitalize">
          {selectedSport} Portfolio
        </h2>
        <div className="space-y-2">
          {portfolioItems
            .filter(
              (item) => normalizePortfolioSport(item.sport) === selectedSport,
            )
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
                {!item.photo && photosById.get(String(item.photoId)) && (
                  <img
                    src={photosById.get(String(item.photoId))?.imageUrl}
                    alt={photosById.get(String(item.photoId))?.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.photo?.title ||
                      photosById.get(String(item.photoId))?.title ||
                      "Untitled"}
                  </h3>
                  {item.caption && (
                    <p className="text-sm text-gray-500 mt-1">{item.caption}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center">
                  {item.isFeatured && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                      ⭐ Featured
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                    title={
                      item.isFeatured
                        ? "Remove from featured"
                        : "Set as featured"
                    }
                  >
                    {item.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm px-3 py-1 border border-red-200 text-red-700 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
        {portfolioItems.filter(
          (item) => normalizePortfolioSport(item.sport) === selectedSport,
        ).length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No images selected for {selectedSport} portfolio yet.
          </p>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Edit Caption
              </h3>
              <p className="text-sm text-gray-500">
                Update the caption shown with this portfolio image.
              </p>
            </div>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Add a short caption..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Save
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
