import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "../../api";

export default function SiteSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    footerText: "",
    instagramHandle: "",
    instagramUrl: "",
    contactEmail: "",
    featuredSectionTitle: "",
    featuredSectionSubtitle: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSiteSettings();
      setFormData({
        siteName: data.siteName || "",
        heroTitle: data.heroTitle || "",
        heroSubtitle: data.heroSubtitle || "",
        heroImage: data.heroImage || "",
        footerText: data.footerText || "",
        instagramHandle: data.instagramHandle || "",
        instagramUrl: data.instagramUrl || "",
        contactEmail: data.contactEmail || "",
        featuredSectionTitle: data.featuredSectionTitle || "",
        featuredSectionSubtitle: data.featuredSectionSubtitle || "",
      });
    } catch (error) {
      console.error("Failed to load settings:", error);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSiteSettings({ id: 1, ...formData });
      alert("Settings saved successfully!");
      await loadSettings();
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Site Settings
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">General</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Homepage Hero Section
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hero Subtitle
                </label>
                <textarea
                  value={formData.heroSubtitle}
                  onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hero Background Image URL
                </label>
                <input
                  type="text"
                  value={formData.heroImage || ""}
                  onChange={(e) => handleChange("heroImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
                {formData.heroImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={formData.heroImage}
                      alt="Hero preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).alt =
                          "Invalid image URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Featured Photos Section
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.featuredSectionTitle}
                  onChange={(e) =>
                    handleChange("featuredSectionTitle", e.target.value)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Section Subtitle
                </label>
                <textarea
                  value={formData.featuredSectionSubtitle}
                  onChange={(e) =>
                    handleChange("featuredSectionSubtitle", e.target.value)
                  }
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Social/Contact */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Contact & Social
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) =>
                    handleChange("instagramHandle", e.target.value)
                  }
                  placeholder="@studiostorm.sports"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/studiostorm.sports"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="info@studiostorm.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Footer</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Footer Text
                </label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => handleChange("footerText", e.target.value)}
                  placeholder="Studio Storm. All rights reserved."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
