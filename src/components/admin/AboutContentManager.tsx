import { useState, useEffect } from "react";
import { getAboutContent, updateAboutContent } from "../../api";
import type { Specialization } from "../../types";

export default function AboutContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    paragraphs: ["", "", ""],
    specializations: [] as Specialization[],
    contactText: "",
    contactLinkText: "",
    contactLinkUrl: "",
    contactSuffix: "",
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getAboutContent();
      setFormData({
        title: data.title || "",
        image: data.image || "",
        paragraphs: data.paragraphs || ["", "", ""],
        specializations: data.specializations || [],
        contactText: data.contactText || "",
        contactLinkText: data.contactLinkText || "",
        contactLinkUrl: data.contactLinkUrl || "",
        contactSuffix: data.contactSuffix || "",
      });
    } catch (error) {
      console.error("Failed to load content:", error);
      alert("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateAboutContent({ id: 1, ...formData });
      alert("Content saved successfully!");
      await loadContent();
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...formData.paragraphs];
    newParagraphs[index] = value;
    setFormData({ ...formData, paragraphs: newParagraphs });
  };

  const addParagraph = () => {
    setFormData({
      ...formData,
      paragraphs: [...formData.paragraphs, ""],
    });
  };

  const removeParagraph = (index: number) => {
    const newParagraphs = formData.paragraphs.filter((_, i) => i !== index);
    setFormData({ ...formData, paragraphs: newParagraphs });
  };

  const handleSpecializationChange = (
    index: number,
    field: keyof Specialization,
    value: string,
  ) => {
    const newSpecs = [...formData.specializations];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData({ ...formData, specializations: newSpecs });
  };

  const addSpecialization = () => {
    setFormData({
      ...formData,
      specializations: [
        ...formData.specializations,
        { name: "", subtitle: "", description: "" },
      ],
    });
  };

  const removeSpecialization = (index: number) => {
    const newSpecs = formData.specializations.filter((_, i) => i !== index);
    setFormData({ ...formData, specializations: newSpecs });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          About Page Content
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Header</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Header Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">Paragraphs</h4>
              <button
                type="button"
                onClick={addParagraph}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Paragraph
              </button>
            </div>
            <div className="space-y-4">
              {formData.paragraphs.map((para, index) => (
                <div key={index} className="relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Paragraph {index + 1}
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      value={para}
                      onChange={(e) =>
                        handleParagraphChange(index, e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                    />
                    {formData.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">
                Specializations
              </h4>
              <button
                type="button"
                onClick={addSpecialization}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Specialization
              </button>
            </div>
            <div className="space-y-6">
              {formData.specializations.map((spec, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-medium text-gray-700">
                      Specialization {index + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={spec.name}
                        onChange={(e) =>
                          handleSpecializationChange(
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={spec.subtitle}
                        onChange={(e) =>
                          handleSpecializationChange(
                            index,
                            "subtitle",
                            e.target.value,
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={spec.description}
                        onChange={(e) =>
                          handleSpecializationChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Contact Section
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Text (before link)
                </label>
                <input
                  type="text"
                  value={formData.contactText}
                  onChange={(e) =>
                    setFormData({ ...formData, contactText: e.target.value })
                  }
                  placeholder="Interesse in sportfotografie? Neem contact op via"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Link Text
                </label>
                <input
                  type="text"
                  value={formData.contactLinkText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactLinkText: e.target.value,
                    })
                  }
                  placeholder="@studiostorm.sports"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.contactLinkUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactLinkUrl: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/studiostorm.sports"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Text (after link)
                </label>
                <input
                  type="text"
                  value={formData.contactSuffix}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactSuffix: e.target.value,
                    })
                  }
                  placeholder="op Instagram of via ons contactformulier."
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
              {saving ? "Saving..." : "Save Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
