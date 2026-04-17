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

// Events
export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function getMainEvents() {
  const res = await fetch(`${API_URL}/events/main`);
  if (!res.ok) throw new Error("Failed to fetch main events");
  return res.json();
}

export async function getEventBySlug(slug: string) {
  const res = await fetch(`${API_URL}/events/slug/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getEventById(id: number) {
  const res = await fetch(`${API_URL}/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export async function getSubevents(parentId: number) {
  const res = await fetch(`${API_URL}/events/${parentId}/subevents`);
  if (!res.ok) throw new Error("Failed to fetch subevents");
  return res.json();
}

export async function getPhotosByEventId(eventId: number) {
  const res = await fetch(`${API_URL}/events/${eventId}/photos`);
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
  updates: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>,
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
  lastName?: string,
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
  lastName?: string,
) {
  const res = await authFetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
    }),
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

export async function createEvent(eventData: {
  name: string;
  slug: string;
  description: string;
  sport?: "athletics" | "volleyball" | "jiu-jitsu" | "other";
  coverPhotoId?: number;
  parentId?: number;
}) {
  const res = await authFetch(`${API_URL}/admin/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function updateEvent(
  id: number,
  updates: Partial<{
    name: string;
    slug: string;
    description: string;
    sport: "athletics" | "volleyball" | "jiu-jitsu" | "other";
    coverPhotoId: number;
    parentId: number;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/events/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

export async function deleteEvent(id: number) {
  const res = await authFetch(`${API_URL}/admin/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete event");
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
  }>,
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
  password: string,
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
  password?: string,
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
    const error = await res
      .json()
      .catch(() => ({ error: "Failed to fetch gallery" }));
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

// ============== CLIENTS (Organizations) ==============

export async function getClients() {
  const res = await fetch(`${API_URL}/clients`);
  if (!res.ok) throw new Error("Failed to fetch clients");
  return res.json();
}

export async function createClient(data: {
  name: string;
  logo?: string;
  website?: string;
  featured?: boolean;
}) {
  const res = await authFetch(`${API_URL}/admin/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create client");
  return res.json();
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    logo?: string;
    website?: string;
    featured?: boolean;
  },
) {
  const res = await authFetch(`${API_URL}/admin/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update client");
  return res.json();
}

export async function deleteClient(id: string) {
  const res = await authFetch(`${API_URL}/admin/clients/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete client");
  return res.json();
}

// ============== CONTACT SUBMISSIONS ==============

export async function submitContactForm(data: {
  name: string;
  email: string;
  organization: string;
  service: string;
  eventDate: string;
  message: string;
}) {
  const res = await fetch(`${API_URL}/contact/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to submit contact form");
  }
  return res.json();
}

export async function getContactSubmissions() {
  const res = await authFetch(`${API_URL}/admin/contact-submissions`);
  if (!res.ok) throw new Error("Failed to fetch contact submissions");
  return res.json();
}

export async function updateContactSubmission(
  id: string,
  status: "new" | "reviewed" | "responded",
) {
  const res = await authFetch(`${API_URL}/admin/contact-submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update contact submission");
  return res.json();
}

export async function deleteContactSubmission(id: string) {
  const res = await authFetch(`${API_URL}/admin/contact-submissions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete contact submission");
  return res.json();
}

// ============== SITE SETTINGS ==============

export async function getSiteSettings() {
  const res = await fetch(`${API_URL}/site-settings`);
  if (!res.ok) throw new Error("Failed to fetch site settings");
  return res.json();
}

export async function updateSiteSettings(data: Record<string, unknown>) {
  const res = await authFetch(`${API_URL}/admin/site-settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update site settings");
  return res.json();
}

// ============== ORGANIZATIONS ADMIN ==============

export async function createOrganization(data: {
  name: string;
  logo?: string;
  website?: string;
}) {
  const res = await authFetch(`${API_URL}/admin/organizations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create organization");
  return res.json();
}

export async function updateOrganization(
  id: number,
  data: { name: string; logo?: string; website?: string },
) {
  const res = await authFetch(`${API_URL}/admin/organizations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update organization");
  return res.json();
}

export async function deleteOrganization(id: number) {
  const res = await authFetch(`${API_URL}/admin/organizations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete organization");
  return res.json();
}

// ============== ABOUT CONTENT ==============

export async function getAboutContent() {
  const res = await fetch(`${API_URL}/about-content`);
  if (!res.ok) throw new Error("Failed to fetch about content");
  return res.json();
}

export async function updateAboutContent(data: Record<string, unknown>) {
  const res = await authFetch(`${API_URL}/admin/about-content`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update about content");
  return res.json();
}

// ============== SERVICES ==============

export async function getServices() {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function createService(serviceData: Record<string, unknown>) {
  const res = await authFetch(`${API_URL}/admin/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });
  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
}

export async function updateService(
  id: string,
  updates: Record<string, unknown>,
) {
  const res = await authFetch(`${API_URL}/admin/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

export async function deleteService(id: string) {
  const res = await authFetch(`${API_URL}/admin/services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete service");
  return res.json();
}

// ============== SPORTS ==============
export async function getSports() {
  const res = await fetch(`${API_URL}/sports`);
  if (!res.ok) throw new Error("Failed to fetch sports");
  return res.json();
}

export async function createSport(data: {
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
}) {
  const res = await authFetch(`${API_URL}/admin/sports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create sport");
  return res.json();
}

export async function updateSport(
  id: number,
  updates: Partial<{
    title: string;
    slug: string;
    summary: string;
    imageUrl: string;
    order: number;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/sports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update sport");
  return res.json();
}

export async function deleteSport(id: number) {
  const res = await authFetch(`${API_URL}/admin/sports/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete sport");
  return res.json();
}

// ============== JOURNAL ==============
export async function getJournalPosts() {
  const res = await fetch(`${API_URL}/journal`);
  if (!res.ok) throw new Error("Failed to fetch journal posts");
  return res.json();
}

export async function createJournalPost(data: {
  title: string;
  date: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
}) {
  const res = await authFetch(`${API_URL}/admin/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create journal entry");
  return res.json();
}

export async function updateJournalPost(
  id: number,
  updates: Partial<{
    title: string;
    date: string;
    summary: string;
    body: string;
    imageUrl: string;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/journal/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update journal entry");
  return res.json();
}

export async function deleteJournalPost(id: number) {
  const res = await authFetch(`${API_URL}/admin/journal/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete journal entry");
  return res.json();
}

// ============== PORTFOLIO ==============

export async function getPortfolio() {
  const res = await fetch(`${API_URL}/portfolio`);
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
}

export async function addToPortfolio(portfolioData: Record<string, unknown>) {
  const res = await authFetch(`${API_URL}/admin/portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(portfolioData),
  });
  if (!res.ok) throw new Error("Failed to add to portfolio");
  return res.json();
}

export async function removeFromPortfolio(id: string) {
  const res = await authFetch(`${API_URL}/admin/portfolio/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from portfolio");
  return res.json();
}

export async function updatePortfolioItem(
  id: string,
  updates: Partial<{
    caption: string;
    sport: string;
    order: number;
    isFeatured: boolean;
  }>,
) {
  const res = await authFetch(`${API_URL}/admin/portfolio/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update portfolio item");
  return res.json();
}

// ============== CONTENT PAGES ==============

export async function getContentPage(slug: string) {
  const res = await fetch(`${API_URL}/content/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch content page");
  return res.json();
}

export async function updateContentPage(
  slug: string,
  pageData: Record<string, unknown>,
) {
  const res = await authFetch(`${API_URL}/admin/content/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pageData),
  });
  if (!res.ok) throw new Error("Failed to update content page");
  return res.json();
}

// ============== SALES METRICS ==============

export async function getSalesMetrics() {
  const res = await authFetch(`${API_URL}/admin/sales/metrics`);
  if (!res.ok) throw new Error("Failed to fetch sales metrics");
  return res.json();
}

// ============== HOME SETTINGS ==============

export async function getHomeSettings() {
  const res = await fetch(`${API_URL}/home-settings`);
  if (!res.ok) throw new Error("Failed to fetch home settings");
  return res.json();
}

export async function updateHomeSettings(data: {
  heroImageUrl?: string;
  heroImageTitle?: string;
  highlights?: Array<{
    id: string;
    title: string;
    imageUrl: string;
    order: number;
  }>;
}) {
  const res = await authFetch(`${API_URL}/admin/home-settings`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update home settings");
  return res.json();
}
