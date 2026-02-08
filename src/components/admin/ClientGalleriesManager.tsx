import { useState, useEffect } from "react";
import {
  getClientGalleries,
  createClientGallery,
  uploadToClientGallery,
  deleteClientGallery,
} from "../../api";
import Lightbox from "../Lightbox";

interface ClientGalleryPhoto {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  uploadedAt?: string;
  likes?: number;
}

interface ClientGallery {
  id: number;
  clientName: string;
  description: string;
  uniqueUrl: string;
  photos: ClientGalleryPhoto[];
  createdAt: string;
}

interface PreparedFile {
  file: File;
  preview: string;
  title: string;
  description: string;
}

export default function ClientGalleriesManager() {
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [uploadingTo, setUploadingTo] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<PreparedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxGallery, setLightboxGallery] = useState<ClientGallery | null>(
    null,
  );

  const loadGalleries = async () => {
    try {
      const data = await getClientGalleries();
      setGalleries(data);
    } catch (err) {
      console.error("Failed to load galleries:", err);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const galleryData = {
      clientName: (formData.get("clientName") as string) || "",
      description: (formData.get("description") as string) || "",
    };

    try {
      await createClientGallery(galleryData);
      await loadGalleries();
      setShowCreate(false);
      form.reset();
    } catch {
      alert("Failed to create gallery");
    }
  };

  const handleFileSelect = (
    galleryId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles: PreparedFile[] = [];

    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 50MB)`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newFiles.push({
        file,
        preview,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
      });
    }

    setSelectedFiles(newFiles);
    setUploadingTo(galleryId);
    e.target.value = "";
  };

  const updateFileData = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const uploadFiles = async (galleryId: number) => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;
    const errors: string[] = [];

    for (const preparedFile of selectedFiles) {
      try {
        const formData = new FormData();
        formData.append("image", preparedFile.file);
        formData.append("title", preparedFile.title || preparedFile.file.name);
        formData.append("description", preparedFile.description);

        await uploadToClientGallery(galleryId, formData);
        successCount++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${preparedFile.file.name}: ${errorMsg}`);
      }
    }

    setUploading(false);

    if (successCount > 0) {
      alert(
        `Uploaded ${successCount} photo(s)${errors.length > 0 ? ` (${errors.length} failed)` : ""}!`,
      );
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);
      setUploadingTo(null);
      await loadGalleries();
    }

    if (errors.length > 0) {
      alert(`Errors: ${errors.slice(0, 3).join(", ")}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery?")) return;
    try {
      await deleteClientGallery(id);
      await loadGalleries();
    } catch {
      alert("Failed to delete gallery");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  const openLightbox = (gallery: ClientGallery, index: number) => {
    setLightboxGallery(gallery);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-900">
          Client Galleries ({galleries.length})
        </h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          {showCreate ? "Cancel" : "Create Gallery"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Create Client Gallery</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                required
                placeholder="e.g., John Doe"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="e.g., Wedding photos from June 2026"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Create Gallery
            </button>
          </form>
        </div>
      )}

      {/* Galleries List */}
      <div className="space-y-4">
        {galleries.map((gallery) => {
          const galleryUrl = `${window.location.origin}/gallery/${gallery.uniqueUrl}`;
          const isUploading =
            uploadingTo === gallery.id && selectedFiles.length > 0;

          return (
            <div
              key={gallery.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900">
                      {gallery.clientName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {gallery.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created:{" "}
                      {new Date(gallery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {gallery.photos.length} photos
                    </p>
                  </div>
                </div>

                {/* Shareable Link */}
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareable Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={galleryUrl}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white"
                    />
                    <button
                      onClick={() => copyToClipboard(galleryUrl)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Full-size Photos Grid with Lightbox */}
                {gallery.photos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Photos ({gallery.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {gallery.photos.map((photo, idx) => (
                        <button
                          key={photo.id}
                          onClick={() => openLightbox(gallery, idx)}
                          className="relative group overflow-hidden rounded-lg h-32 bg-gray-100"
                        >
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              🔍
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                            {photo.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Section */}
                {isUploading ? (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <h4 className="font-medium text-gray-900">
                      Upload {selectedFiles.length} Photo(s)
                    </h4>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded border border-gray-200"
                        >
                          <div className="flex gap-3">
                            <img
                              src={file.preview}
                              alt={file.file.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                value={file.title}
                                onChange={(e) =>
                                  updateFileData(idx, "title", e.target.value)
                                }
                                disabled={uploading}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-1 disabled:opacity-50"
                                placeholder="Photo title"
                              />
                              <textarea
                                value={file.description}
                                onChange={(e) =>
                                  updateFileData(
                                    idx,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                disabled={uploading}
                                rows={2}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                                placeholder="Description (optional)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                URL.revokeObjectURL(file.preview);
                                setSelectedFiles(
                                  selectedFiles.filter((_, i) => i !== idx),
                                );
                              }}
                              disabled={uploading}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          selectedFiles.forEach((f) =>
                            URL.revokeObjectURL(f.preview),
                          );
                          setSelectedFiles([]);
                          setUploadingTo(null);
                        }}
                        disabled={uploading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => uploadFiles(gallery.id)}
                        disabled={uploading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {uploading
                          ? `⏳ Uploading...`
                          : `Upload ${selectedFiles.length} Photo(s)`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelect(gallery.id, e)}
                        className="hidden"
                      />
                      <div className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 text-center">
                        + Upload Photos
                      </div>
                    </label>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {galleries.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              No client galleries yet. Create one to get started!
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && lightboxGallery && (
        <Lightbox
          images={lightboxGallery.photos.map((p) => p.imageUrl)}
          initialIndex={lightboxIndex}
          title={`${lightboxGallery.clientName} - Photo ${lightboxIndex + 1}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
