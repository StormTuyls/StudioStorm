import { useEffect, useMemo, useState } from "react";
import {
  createJournalPost,
  deleteJournalPost,
  getJournalPosts,
  updateJournalPost,
} from "../../api";
import type { JournalPost } from "../../types";

const emptyForm = {
  title: "",
  date: "",
  summary: "",
  body: "",
  imageUrl: "",
};

export default function JournalManager() {
  const [entries, setEntries] = useState<JournalPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getJournalPosts();
        setEntries(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load journal posts",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, [entries]);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) return;
    setError(null);

    try {
      if (editingId) {
        const updated = await updateJournalPost(editingId, formData);
        setEntries((prev) =>
          prev.map((entry) => (entry.id === editingId ? updated : entry)),
        );
      } else {
        const created = await createJournalPost(formData);
        setEntries((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save journal entry",
      );
    }
  };

  const handleEdit = (entry: JournalPost) => {
    setFormData({
      title: entry.title,
      date: entry.date,
      summary: entry.summary || "",
      body: entry.body || "",
      imageUrl: entry.imageUrl || "",
    });
    setEditingId(entry.id ?? null);
    setIsCreating(true);
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id || !confirm("Delete this journal entry?")) return;
    setError(null);

    try {
      await deleteJournalPost(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete journal entry",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Journal</h2>
          <p className="text-sm text-gray-600 mt-1">
            Publish short posts and reference images from your library.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Add Entry
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-sm text-gray-500">Loading journal entries...</div>
      )}

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g., BK Veldlopen 2026 Highlights"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="month"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
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
              placeholder="Short intro shown on the journal list"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              rows={5}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Full post content"
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
              placeholder="Paste an image URL from your uploads"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              {isEditing ? "Update Entry" : "Publish Entry"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y">
        {entries.length === 0 ? (
          <div className="py-8 text-center text-gray-600">
            No journal entries yet.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id || entry.title}
              className="py-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    {entry.date}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900">
                    {entry.title}
                  </h3>
                </div>
                {entry.summary && (
                  <p className="text-sm text-gray-600">{entry.summary}</p>
                )}
                {entry.imageUrl && (
                  <p className="text-xs text-gray-500">
                    Image: {entry.imageUrl}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-sm px-3 py-1 border border-red-200 text-red-700 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
