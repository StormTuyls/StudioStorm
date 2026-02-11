const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Helper to get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem("token");
}

// Helper to make authenticated requests
async function authFetch(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return fetch(url, { ...options, headers });
}

// Photos
export async function getPhotos() {
  const res = await fetch(`${API_URL}/photos`);
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json();
}

export async function getPhotoById(id: number) {
  const res = await fetch(`${API_URL}/photos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch photo");
  return res.json();
}

export async function getFeaturedPhotos() {
  const res = await fetch(`${API_URL}/photos/featured/list`);
  if (!res.ok) throw new Error("Failed to fetch featured photos");
  return res.json();
}

export async function likePhoto(id: number) {
  const res = await fetch(`${API_URL}/photos/${id}/like`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to like photo");
  }
  return res.json();
}

// Albums
export async function getAlbums() {
  const res = await fetch(`${API_URL}/albums`);
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function getMainAlbums() {
  const res = await fetch(`${API_URL}/albums/main`);
  if (!res.ok) throw new Error("Failed to fetch main albums");
  return res.json();
}

export async function getAlbumBySlug(slug: string) {
  const res = await fetch(`${API_URL}/albums/slug/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getAlbumById(id: number) {
  const res = await fetch(`${API_URL}/albums/${id}`);
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
}

export async function getSubalbums(parentId: number) {
  const res = await fetch(`${API_URL}/albums/${parentId}/subalbums`);
  if (!res.ok) throw new Error("Failed to fetch subalbums");
  return res.json();
}

export async function getPhotosByAlbumId(albumId: number) {
  const res = await fetch(`${API_URL}/albums/${albumId}/photos`);
  if (!res.ok) throw new Error("Failed to fetch photos");
  return res.json();
}

// Organizations
export async function getOrganizations() {
  const res = await fetch(`${API_URL}/organizations`);
  if (!res.ok) throw new Error("Failed to fetch organizations");
  return res.json();
}

// ==================== USER MANAGEMENT APIs ====================

export async function getUsers() {
  const res = await authFetch(`${API_URL}/admin/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function getUserById(id: number) {
  const res = await authFetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function updateUser(
  id: number,
  updates: Partial<{ firstName: string; lastName: string; email: string; role: string }>
) {
  const res = await authFetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await authFetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

// ==================== ADMIN APIs ====================

// ==================== AUTH APIs ====================

export async function register(
  username: string,
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, firstName, lastName }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Registration failed");
  }
  return res.json();
}

// Admin creates user with role
export async function createUser(
  username: string,
  email: string,
  password: string,
  role: string,
  firstName?: string,
  lastName?: string
) {
  const res = await authFetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, firstName, lastName, role }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create user");
  }
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }
  return res.json();
}

export async function logout() {
  localStorage.removeItem("token");
}

export async function getCurrentUser() {
  const res = await authFetch(`${API_URL}/auth/me`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Admin - Photos
export async function createPhoto(formData: FormData) {
  const res = await authFetch(`${API_URL}/admin/photos`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create photo");
  return res.json();
}

export async function updatePhoto(
  id: number,
  updates: Partial<{
    isFeatured: boolean;
    title: string;
    description: string;
    location: string;
    albumId: number;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/photos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update photo");
  return res.json();
}

export async function deletePhoto(id: number) {
  const res = await authFetch(`${API_URL}/admin/photos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete photo");
  return res.json();
}

// Admin - Albums
export async function createAlbum(albumData: {
  name: string;
  slug: string;
  description: string;
  coverPhotoId?: number;
  parentId?: number;
}) {
  const res = await authFetch(`${API_URL}/admin/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(albumData),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
}

export async function updateAlbum(
  id: number,
  updates: Partial<{
    name: string;
    slug: string;
    description: string;
    coverPhotoId: number;
    parentId: number;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/albums/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update album");
  return res.json();
}

export async function deleteAlbum(id: number) {
  const res = await authFetch(`${API_URL}/admin/albums/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete album");
  return res.json();
}

// Admin - Client Galleries
export async function createClientGallery(galleryData: {
  clientName: string;
  description: string;
  userId?: number;
  password?: string;
  expiresAt?: string;
  allowDownload?: boolean;
}) {
  const res = await authFetch(`${API_URL}/admin/client-galleries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(galleryData),
  });
  if (!res.ok) throw new Error("Failed to create gallery");
  return res.json();
}

export async function getClientGalleries() {
  const res = await authFetch(`${API_URL}/admin/client-galleries`);
  if (!res.ok) throw new Error("Failed to fetch galleries");
  return res.json();
}

export async function updateClientGallery(
  id: number,
  updates: Partial<{
    clientName: string;
    description: string;
    userId: number | null;
    password: string | null;
    expiresAt: string | null;
    allowDownload: boolean;
  }>
) {
  const res = await authFetch(`${API_URL}/admin/client-galleries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update gallery");
  return res.json();
}

export async function uploadToClientGallery(
  galleryId: number,
  formData: FormData,
) {
  const res = await authFetch(
    `${API_URL}/admin/client-galleries/${galleryId}/photos`,
    {
      method: "POST",
      body: formData,
    },
  );
  if (!res.ok) throw new Error("Failed to upload photo");
  return res.json();
}

export async function deleteClientGallery(id: number) {
  const res = await authFetch(`${API_URL}/admin/client-galleries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete gallery");
  return res.json();
}

// Client - My Galleries
export async function getMyGalleries() {
  const res = await authFetch(`${API_URL}/my-galleries`);
  if (!res.ok) throw new Error("Failed to fetch your galleries");
  return res.json();
}

export async function verifyGalleryPassword(
  uniqueUrl: string,
  password: string
) {
  const res = await fetch(`${API_URL}/galleries/${uniqueUrl}/verify-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Failed to verify password");
  return res.json();
}

export async function getClientGalleryByUrl(
  uniqueUrl: string,
  password?: string
) {
  const url = new URL(`${API_URL}/galleries/${uniqueUrl}`);
  if (password) {
    url.searchParams.append("password", password);
  }
  
  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch gallery" }));
    throw new Error(error.error || "Failed to fetch gallery");
  }
  return res.json();
}

export async function likeGalleryPhoto(uniqueUrl: string, photoId: number) {
  const res = await fetch(
    `${API_URL}/galleries/${uniqueUrl}/photos/${photoId}/like`,
    {
      method: "PATCH",
    },
  );
  if (!res.ok) {
    try {
      const error = await res.json();
      throw new Error(error.error || `Failed to like photo (${res.status})`);
    } catch {
      // If response is not JSON, use status text
      throw new Error(
        `Failed to like photo (${res.status}): ${res.statusText}`,
      );
    }
  }
  return res.json();
}
