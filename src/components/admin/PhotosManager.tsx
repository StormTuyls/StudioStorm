import { useState, useEffect } from "react";
import {
  getPhotos,
  getAlbums,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "../../api";
import type { Photo, Album } from "../../types";

interface UploadedFile {
  file: File;
  preview: string;
  title: string;
  description: string;
  location: string;
  albumId: string;
  metadata?: {
    camera?: { model: string; make: string };
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    dateTaken?: string;
  };
}

export default function PhotosManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    location: string;
    albumId: string;
  }>({ title: "", description: "", location: "", albumId: "" });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [photosData, albumsData] = await Promise.all([
        getPhotos(),
        getAlbums(),
      ]);
      setPhotos(photosData);
      setAlbums(albumsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles: UploadedFile[] = [];

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${file.name} is too large (max 10MB)`);
        continue;
      }

      const preview = URL.createObjectURL(file);

      // Extract EXIF metadata from the file
      let metadata = undefined;
      try {
        metadata = await extractMetadataFromFile(file);
      } catch (err) {
        console.warn(`Could not extract metadata from ${file.name}`, err);
      }

      newFiles.push({
        file,
        preview,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: "",
        location: "",
        albumId: "",
        metadata,
      });
    }

    setSelectedFiles([...selectedFiles, ...newFiles]);
    e.target.value = "";
  };

  const extractMetadataFromFile = async (
    file: File,
  ): Promise<UploadedFile["metadata"]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (!data) {
          resolve(undefined);
          return;
        }
        // The server will extract EXIF data
        // For now we just pass it along
        resolve(undefined);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const removeFile = (index: number) => {
    const file = selectedFiles[index];
    URL.revokeObjectURL(file.preview);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const updateFileData = (
    index: number,
    field: keyof Omit<UploadedFile, "file" | "preview" | "metadata">,
    value: string,
  ) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadError("No files selected");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    let successCount = 0;
    const errors: string[] = [];

    for (const uploadedFile of selectedFiles) {
      try {
        if (!uploadedFile.title.trim()) {
          errors.push(`${uploadedFile.file.name}: Title is required`);
          continue;
        }

        const formData = new FormData();
        formData.append("image", uploadedFile.file);
        formData.append("title", uploadedFile.title);
        formData.append("description", uploadedFile.description);
        formData.append("location", uploadedFile.location);

        // Only append albumId if it's not empty
        if (uploadedFile.albumId) {
          formData.append("albumId", uploadedFile.albumId);
        }

        await createPhoto(formData);
        successCount++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${uploadedFile.file.name}: ${errorMsg}`);
      }
    }

    setUploading(false);

    if (errors.length === 0) {
      setUploadSuccess(`✅ Successfully uploaded ${successCount} photo(s)!`);
      setSelectedFiles([]);
      await loadData();
      setTimeout(() => {
        setShowUpload(false);
        setUploadSuccess(null);
      }, 2000);
    } else {
      if (successCount > 0) {
        setUploadSuccess(
          `✅ Uploaded ${successCount} photo(s), ${errors.length} failed`,
        );
      }
      setUploadError(`Failed to upload: ${errors.join(", ")}`);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await uploadFiles();
  };

  const handleToggleFeatured = async (photo: Photo) => {
    try {
      await updatePhoto(photo.id, { isFeatured: !photo.isFeatured });
      await loadData();
    } catch {
      alert("Failed to update photo");
    }
  };
  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditForm({
      title: photo.title,
      description: photo.description,
      location: photo.location,
      albumId: photo.albumId?.toString() || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPhoto || !editForm.title.trim()) {
      alert("Title is required");
      return;
    }

    setEditLoading(true);
    try {
      await updatePhoto(editingPhoto.id, {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        albumId: editForm.albumId ? Number(editForm.albumId) : undefined,
      });
      setEditingPhoto(null);
      await loadData();
    } catch (err) {
      alert(
        "Failed to update photo: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    } finally {
      setEditLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deletePhoto(id);
      await loadData();
    } catch {
      alert("Failed to delete photo");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-900">
          Photos ({photos.length})
        </h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          {showUpload ? "Cancel" : "Upload Photo"}
        </button>
      </div>
      {/* Upload Form */}
      {showUpload && (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-lg font-medium mb-4">Batch Upload Photos</h3>

          {uploadSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {uploadSuccess}
            </div>
          )}

          {uploadError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              ❌ {uploadError}
            </div>
          )}

          {selectedFiles.length === 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image Files{" "}
                <span className="text-xs text-gray-500">(max 10MB each)</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="w-full border border-gray-300 rounded-md p-2 disabled:opacity-50 cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-2">
                Select one or multiple photos to upload
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              {/* File List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      selectedFiles.forEach((f) =>
                        URL.revokeObjectURL(f.preview),
                      );
                      setSelectedFiles([]);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                    disabled={uploading}
                  >
                    Clear All
                  </button>
                </div>

                {selectedFiles.map((uploadedFile, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex gap-4">
                      {/* Preview */}
                      <div className="shrink-0">
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      </div>

                      {/* Edit Fields */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={uploadedFile.title}
                            onChange={(e) =>
                              updateFileData(idx, "title", e.target.value)
                            }
                            disabled={uploading}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                            placeholder="Photo title"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            value={uploadedFile.description}
                            onChange={(e) =>
                              updateFileData(idx, "description", e.target.value)
                            }
                            disabled={uploading}
                            rows={2}
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                            placeholder="Photo description"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              Location
                            </label>
                            <input
                              type="text"
                              value={uploadedFile.location}
                              onChange={(e) =>
                                updateFileData(idx, "location", e.target.value)
                              }
                              disabled={uploading}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                              placeholder="Event location"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              Album
                            </label>
                            <select
                              value={uploadedFile.albumId}
                              onChange={(e) =>
                                updateFileData(idx, "albumId", e.target.value)
                              }
                              disabled={uploading}
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                            >
                              <option value="">No Album</option>
                              {albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                  {album.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Metadata Display */}
                        {uploadedFile.metadata && (
                          <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
                            <p>
                              📷 {uploadedFile.metadata.camera?.make}{" "}
                              {uploadedFile.metadata.camera?.model}
                            </p>
                            <p>
                              ISO {uploadedFile.metadata.iso} •{" "}
                              {uploadedFile.metadata.aperture} •{" "}
                              {uploadedFile.metadata.shutterSpeed}
                            </p>
                            <p>📏 {uploadedFile.metadata.focalLength}</p>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        disabled={uploading}
                        className="shrink-0 text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    selectedFiles.forEach((f) =>
                      URL.revokeObjectURL(f.preview),
                    );
                    setSelectedFiles([]);
                  }}
                  disabled={uploading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {uploading
                    ? `⏳ Uploading... (${selectedFiles.length} files)`
                    : `Upload ${selectedFiles.length} Photo${selectedFiles.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{photo.title}</h3>
                {photo.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{photo.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>❤️ {photo.likes}</span>
                <span>{photo.location}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditPhoto(photo)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleFeatured(photo)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  {photo.isFeatured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-medium text-gray-900">Edit Photo</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Photo title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Photo description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Event location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Album
              </label>
              <select
                value={editForm.albumId}
                onChange={(e) =>
                  setEditForm({ ...editForm, albumId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">No Album</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Camera Info (Read-only) */}
            {editingPhoto.camera && (
              <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 space-y-1">
                <p className="font-medium">📷 Camera Metadata:</p>
                <p>
                  {editingPhoto.camera.make} {editingPhoto.camera.model}
                </p>
                {editingPhoto.lens && editingPhoto.lens !== "Unknown" && (
                  <p>Lens: {editingPhoto.lens}</p>
                )}
                <p>
                  ISO {editingPhoto.iso} • {editingPhoto.aperture} •{" "}
                  {editingPhoto.shutterSpeed} • {editingPhoto.focalLength}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditingPhoto(null)}
                disabled={editLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
}
