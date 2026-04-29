import { useEffect, useState } from "react";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../../api";
import type { Service } from "../../types";
export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sport: "athletics" as const,
    whatsIncluded: [""],
    startingPrice: 0,
    deliverables: [""],
    ctaLabel: "Get Started",
    ctaUrl: "",
    isActive: true,
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch {
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateService(editingId, formData);
        setServices((prev) =>
          prev.map((service) => (service.id === editingId ? updated : service)),
        );
      } else {
        const created = await createService(formData);
        setServices((prev) => [...prev, created]);
      }
      setIsCreating(false);
      resetForm();
    } catch {
      alert("Failed to save service");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sport: "athletics",
      whatsIncluded: [""],
      startingPrice: 0,
      deliverables: [""],
      ctaLabel: "Get Started",
      ctaUrl: "",
      isActive: true,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-900">Services</h2>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Add Service
          </button>
        )}
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Event Photography Package"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              rows={3}
              placeholder="Describe what this service offers..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sport
              </label>
              <select
                value={formData.sport}
                onChange={(e) =>
                  setFormData({ ...formData, sport: e.target.value as any })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="athletics">Athletics</option>
                <option value="volleyball">Volleyball</option>
                <option value="jiu-jitsu">Jiu-Jitsu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price
              </label>
              <input
                type="number"
                value={formData.startingPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startingPrice: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Save Service
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No services yet. Create one to get started.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start hover:shadow-md transition"
            >
              <div>
                <h3 className="font-medium text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {service.description}
                </p>
                <div className="flex gap-4 mt-3 text-xs text-gray-600">
                  <span>From ${service.startingPrice}</span>
                  <span className="capitalize">{service.sport}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      name: service.name,
                      description: service.description,
                      sport: service.sport || "athletics",
                      whatsIncluded: service.whatsIncluded || [""],
                      startingPrice: service.startingPrice || 0,
                      deliverables: service.deliverables || [""],
                      ctaLabel: service.ctaLabel || "Get Started",
                      ctaUrl: service.ctaUrl || "",
                      isActive: service.isActive,
                    });
                    setEditingId(service.id || null);
                    setIsCreating(true);
                  }}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!service.id) return;
                    if (!confirm("Delete this service?")) return;
                    try {
                      await deleteService(service.id);
                      setServices((prev) =>
                        prev.filter((item) => item.id !== service.id),
                      );
                    } catch {
                      alert("Failed to delete service");
                    }
                  }}
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
