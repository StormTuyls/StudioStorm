import { useState, useEffect } from "react";
import {
  getClientGalleries,
  createClientGallery,
  uploadToClientGallery,
  deleteClientGallery,
  updateClientGallery,
  getUsers,
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
  userId?: number | null;
  isProtected?: boolean;
  expiresAt?: string | null;
  allowDownload?: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface PreparedFile {
  file: File;
  preview: string;
  title: string;
  description: string;
}

export default function ClientGalleriesManager() {
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [uploadingTo, setUploadingTo] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<PreparedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxGallery, setLightboxGallery] = useState<ClientGallery | null>(
    null,
  );
  const [editingGallery, setEditingGallery] = useState<ClientGallery | null>(
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

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      // Filter to only show client users
      setUsers(data.filter((u: User) => u.role === "client"));
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    loadGalleries();
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const userId = formData.get("userId") as string;
    const password = formData.get("password") as string;
    const expiresAt = formData.get("expiresAt") as string;
    const allowDownload = formData.get("allowDownload") === "on";

    const galleryData = {
      clientName: (formData.get("clientName") as string) || "",
      description: (formData.get("description") as string) || "",
      userId: userId ? Number(userId) : undefined,
      password: password || undefined,
      expiresAt: expiresAt || undefined,
      allowDownload,
    };

    try {
      await createClientGallery(galleryData);
      await loadGalleries();
      setShowCreate(false);
      form.reset();
    } catch (err) {
      alert("Failed to create gallery: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGallery) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const userId = formData.get("userId") as string;
    const password = formData.get("password") as string;
    const expiresAt = formData.get("expiresAt") as string;
    const allowDownload = formData.get("allowDownload") === "on";

    const updates = {
      clientName: (formData.get("clientName") as string) || "",
      description: (formData.get("description") as string) || "",
      userId: userId ? Number(userId) : null,
      password: password || null,
      expiresAt: expiresAt || null,
      allowDownload,
    };

    try {
      await updateClientGallery(editingGallery.id, updates);
      await loadGalleries();
      setEditingGallery(null);
    } catch (err) {
      alert("Failed to update gallery: " + (err instanceof Error ? err.message : "Unknown error"));
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
                placeholder="e.g., John Doe - Event 2026"
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
                placeholder="e.g., Your photos from the athletics championship"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Client Account
              </label>
              <select
                name="userId"
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">-- None (Public) --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName || user.username} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Assigned clients can access without password
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Protection
              </label>
              <input
                type="text"
                name="password"
                placeholder="Leave empty for no password"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Require password to view gallery
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                name="expiresAt"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional: Gallery becomes inaccessible after this date
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowDownload"
                id="allowDownload"
                defaultChecked
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="allowDownload"
                className="ml-2 block text-sm text-gray-700"
              >
                Allow photo downloads
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Create Gallery
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingGallery && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Edit Gallery</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                required
                defaultValue={editingGallery.clientName}
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
                defaultValue={editingGallery.description}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Client Account
              </label>
              <select
                name="userId"
                defaultValue={editingGallery.userId || ""}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">-- None (Public) --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName || user.username} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Protection
              </label>
              <input
                type="text"
                name="password"
                placeholder="Leave empty to remove password"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                name="expiresAt"
                defaultValue={
                  editingGallery.expiresAt
                    ? new Date(editingGallery.expiresAt).toISOString().split("T")[0]
                    : ""
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowDownload"
                id="allowDownloadEdit"
                defaultChecked={editingGallery.allowDownload !== false}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="allowDownloadEdit"
                className="ml-2 block text-sm text-gray-700"
              >
                Allow photo downloads
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingGallery(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
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
                    <div className="flex flex-wrap gap-3 mt-3 text-xs">
                      <span className="text-gray-500">
                        Created: {new Date(gallery.createdAt).toLocaleDateString()}
                      </span>
                      {gallery.userId && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          👤 Assigned to user
                        </span>
                      )}
                      {gallery.isProtected && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                          🔒 Password protected
                        </span>
                      )}
                      {gallery.expiresAt && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          ⏰ Expires: {new Date(gallery.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                      {gallery.allowDownload === false && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          🚫 Downloads disabled
                        </span>
                      )}
                    </div>
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
                      onClick={() => setEditingGallery(gallery)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
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
