import { useState, useEffect } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../../api";
import type { Client } from "../../types";

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    featured: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateClient(editingId, formData);
      } else {
        await createClient(formData);
      }
      setFormData({ name: "", logo: "", website: "", featured: false });
      setEditingId(null);
      setIsCreating(false);
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client");
    }
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      logo: client.logo || "",
      website: client.website || "",
      featured: client.featured || false,
    });
    setEditingId(client.id || null);
    setIsCreating(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm("Are you sure you want to delete this client?")) return;
    try {
      await deleteClient(id);
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", logo: "", website: "", featured: false });
    setEditingId(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-600">Loading clients...</div>
    );
  }

  const totalClients = clients.length;
  const featuredClients = clients.filter((client) => client.featured).length;
  const totalRevenue = clients.reduce(
    (sum, client) => sum + (client.totalRevenue || 0),
    0,
  );
  const totalEventsCovered = clients.reduce(
    (sum, client) => sum + (client.eventsCovered || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-900">Manage Clients</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            Add Client
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Total Clients
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {totalClients}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Featured
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {featuredClients}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Events Covered
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            {totalEventsCovered}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Total Revenue
          </p>
          <p className="text-2xl font-light text-gray-900 mt-2">
            ${totalRevenue.toFixed(0)}
          </p>
        </div>
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-lg border"
        >
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="e.g., Atletieknieuws"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="https://..."
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured on home page
              </span>
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                {editingId ? "Update Client" : "Create Client"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="divide-y">
        {clients.length === 0 ? (
          <p className="p-4 text-center text-gray-600">No clients yet.</p>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="p-4 flex justify-between items-start hover:bg-gray-50"
            >
              <div>
                <h3 className="font-medium text-gray-900">{client.name}</h3>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {client.website}
                  </a>
                )}
                {client.featured && (
                  <p className="text-xs text-green-600 mt-1">Featured</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
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
