import { useMemo, useState, useEffect } from "react";
import { createSport, deleteSport, getSports, updateSport } from "../../api";
import type { Sport } from "../../types";
import AlbumsManager from "./AlbumsManager";

export default function SportsManager() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    imageUrl: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await getSports();
        setSports(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sports");
      } finally {
        setLoading(false);
      }
    };

    void loadSports();
  }, []);

  const hasDuplicateSlug = useMemo(() => {
    const slug = formData.slug.trim().toLowerCase();
    if (!slug) return false;
    return sports.some(
      (sport) => sport.slug === slug && sport.id !== editingId,
    );
  }, [formData.slug, sports, editingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug.trim().toLowerCase();
    const title = formData.title.trim();

    if (!title || !slug || hasDuplicateSlug) return;
    setError(null);

    try {
      if (editingId) {
        const updated = await updateSport(editingId, {
          title,
          slug,
          summary: formData.summary.trim(),
          imageUrl: formData.imageUrl.trim(),
        });
        setSports((prev) =>
          prev.map((sport) => (sport.id === editingId ? updated : sport)),
        );
      } else {
        const created = await createSport({
          title,
          slug,
          summary: formData.summary.trim(),
          imageUrl: formData.imageUrl.trim(),
        });
        setSports((prev) => [...prev, created]);
      }
      setFormData({ title: "", slug: "", summary: "", imageUrl: "" });
      setIsCreating(false);
      setEditingId(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editingId
            ? "Failed to update sport"
            : "Failed to create sport",
      );
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id || !confirm("Are you sure you want to delete this sport?")) return;
    try {
      await deleteSport(id);
      setSports((prev) => prev.filter((sport) => sport.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sport");
    }
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              Sports Catalog
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Maintain the list of sports shown on the website.
            </p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Add Sport
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 border border-red-200 bg-red-50 text-sm text-red-700 rounded">
            {error}
          </div>
        )}

        {loading && (
          <p className="mt-4 text-sm text-gray-500">Loading sports...</p>
        )}

        {isCreating && (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sport Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g., Atletiek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="e.g., atletiek"
                />
                {hasDuplicateSlug && (
                  <p className="text-xs text-red-600 mt-2">
                    That slug is already in use.
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Short description for the sports overview page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={hasDuplicateSlug}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {editingId ? "Update Sport" : "Save Sport"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  setFormData({
                    title: "",
                    slug: "",
                    summary: "",
                    imageUrl: "",
                  });
                }}
                className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 divide-y">
          {sports.length === 0 ? (
            <p className="text-sm text-gray-600 py-4">No sports added yet.</p>
          ) : (
            sports.map((sport) => (
              <div
                key={sport.id || sport.slug}
                className="py-4 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{sport.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">/{sport.slug}</p>
                  {sport.summary && (
                    <p className="text-sm text-gray-600 mt-2">
                      {sport.summary}
                    </p>
                  )}
                  {sport.imageUrl && (
                    <p className="text-xs text-gray-500 mt-2">
                      Image: {sport.imageUrl}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsCreating(true);
                      setEditingId(sport.id ?? null);
                      setFormData({
                        title: sport.title,
                        slug: sport.slug,
                        summary: sport.summary || "",
                        imageUrl: sport.imageUrl || "",
                      });
                    }}
                    className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sport.id)}
                    className="text-sm px-3 py-1 border border-red-200 text-red-700 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-900">Events</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add events and assign them to a sport for website visibility.
          </p>
        </div>
        <AlbumsManager />
      </section>
    </div>
  );
}
