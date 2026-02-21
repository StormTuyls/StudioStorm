import { useState, useEffect } from "react";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "../../api";
import type { Organization } from "../../types";

export default function OrganizationsManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error("Failed to load organizations:", error);
      alert("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOrganization(editingId, formData);
      } else {
        await createOrganization(formData);
      }
      setFormData({ name: "", logo: "", website: "" });
      setEditingId(null);
      await loadOrganizations();
    } catch (error) {
      console.error("Failed to save organization:", error);
      alert("Failed to save organization");
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingId(org.id);
    setFormData({
      name: org.name,
      logo: org.logo || "",
      website: org.website || "",
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      await deleteOrganization(id);
      await loadOrganizations();
    } catch (error) {
      console.error("Failed to delete organization:", error);
      alert("Failed to delete organization");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", logo: "", website: "" });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingId ? "Edit Organization" : "Add Organization"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              placeholder="https://example.com"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Organizations ({organizations.length})
          </h3>
          <div className="space-y-4">
            {organizations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No organizations yet. Add one above.
              </p>
            ) : (
              organizations.map((org) => (
                <div
                  key={org.id}
                  className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {org.logo && (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="w-16 h-16 object-contain bg-gray-50 rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{org.name}</h4>
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {org.website}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(org)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
