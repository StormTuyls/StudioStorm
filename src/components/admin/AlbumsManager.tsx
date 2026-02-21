import { useState, useEffect } from "react";
import { getEvents, getPhotos, createEvent, deleteEvent } from "../../api";
import type { Event, Photo } from "../../types";

export default function AlbumsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"main" | "sub">("main");
  const [selectedParentId, setSelectedParentId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, photosData] = await Promise.all([
        getEvents(),
        getPhotos(),
      ]);
      setEvents(eventsData);
      setPhotos(photosData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const sport = formData.get("sport") as string | null;

    const eventData = {
      name: (formData.get("name") as string) || "",
      slug: (formData.get("slug") as string) || "",
      description: (formData.get("description") as string) || "",
      ...(sport &&
        sport !== "" && {
          sport: sport as "athletics" | "volleyball" | "jiu-jitsu" | "other",
        }),
      coverPhotoId: formData.get("coverPhotoId")
        ? Number(formData.get("coverPhotoId"))
        : undefined,
      ...(selectedParentId && { parentId: Number(selectedParentId) }),
    };

    try {
      await createEvent(eventData);
      await loadData();
      setShowCreate(false);
      setCreateMode("main");
      setSelectedParentId(null);
      form.reset();
    } catch {
      alert("Failed to create event");
    }
  };

  const handleDelete = async (id: string | number | undefined) => {
    if (!id || !confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(Number(id));
      await loadData();
    } catch {
      alert("Failed to delete event");
    }
  };

  const mainEvents = events.filter((event) => !event.parentId);
  const getSubevents = (parentId: string | number) =>
    events.filter((event) => event.parentId === parentId);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-900">
          Events ({events.length})
        </h2>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            setCreateMode("main");
            setSelectedParentId(null);
          }}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          {showCreate ? "Cancel" : "+ Year"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-100">
          <h3 className="text-lg font-medium mb-2">
            {createMode === "main"
              ? "Create Year"
              : `Add Event to ${events.find((event) => event.id === selectedParentId)?.name}`}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {createMode === "main"
              ? "Years are the top level (e.g., 2026, 2025)"
              : "Events live under a year (e.g., BK Veldlopen)"}
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder={
                  createMode === "main" ? "e.g., 2026" : "e.g., BK Veldlopen"
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug * (used in web address)
              </label>
              <div className="flex items-center">
                {createMode === "sub" && (
                  <span className="text-gray-600 mr-2">
                    /
                    {
                      events.find((event) => event.id === selectedParentId)
                        ?.slug
                    }
                    /
                  </span>
                )}
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder={createMode === "main" ? "2026" : "bk-veldlopen"}
                  className="flex-1 border border-gray-300 rounded-md p-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use lowercase, hyphens for spaces
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Optional description of this album"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {createMode === "sub" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport *
                </label>
                <select
                  name="sport"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">-- Select sport --</option>
                  <option value="athletics">🏃 Athletics (Atletiek)</option>
                  <option value="volleyball">🏐 Volleyball (Volleybal)</option>
                  <option value="jiu-jitsu">🥋 Jiu-Jitsu</option>
                  <option value="other">📸 Other</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Photo
              </label>
              <select
                name="coverPhotoId"
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">No cover photo</option>
                {photos.map((photo) => (
                  <option key={photo.id} value={photo.id}>
                    {photo.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Create {createMode === "main" ? "Year" : "Event"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setCreateMode("main");
                  setSelectedParentId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Albums List */}
      <div className="space-y-6">
        {mainEvents.map((event) => {
          const subevents = event.id ? getSubevents(event.id) : [];
          const coverPhoto = photos.find((p) => p.id === event.coverPhotoId);

          return (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      /{event.slug}
                    </p>
                  </div>
                  {coverPhoto && (
                    <img
                      src={coverPhoto.imageUrl}
                      alt={event.name}
                      className="w-24 h-24 object-cover rounded ml-4"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (event.id) {
                        setShowCreate(true);
                        setCreateMode("sub");
                        setSelectedParentId(event.id);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    + Add Event
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                  >
                    Delete Year
                  </button>
                </div>

                {/* Subalbums */}
                {subevents.length > 0 && (
                  <div className="mt-4 pl-4 border-l-4 border-blue-300 bg-blue-50 p-4 rounded">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Events ({subevents.length})
                    </h4>
                    <div className="space-y-2">
                      {subevents.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-white rounded border border-blue-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {sub.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              /{event.slug}/{sub.slug}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subevents.length === 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                    No events yet. Click "Add Event" to create one.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
