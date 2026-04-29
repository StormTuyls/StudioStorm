// ==================== PHOTO & MEDIA ====================
export interface Photo {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  dateTaken: string;
  location?: string;
  camera?: {
    model: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
  };
  width?: number;
  height?: number;
  eventId?: string;
  isFeatured?: boolean;
  promotedToPortfolio?: boolean;
  portfolioCaption?: string;
  createdAt?: Date;
}

// ==================== EVENTS (REVENUE CORE) ====================
export interface Event {
  id?: string | number;
  name: string;
  slug?: string;
  sport?: "athletics" | "volleyball" | "jiu-jitsu" | "other";
  date?: string;
  location?: string;
  coverPhotoId?: string | number;
  description?: string;
  visibility?: "public" | "private" | "hidden";
  expirationDate?: string;
  pricingPresetId?: string;
  customPrice?: number;
  photos?: Photo[];
  downloadSettings?: {
    allowDownload: boolean;
    watermarkRequired: boolean;
    maxResolution?: "full" | "2k" | "1080p";
  };
  revenue?: number;
  status?: "draft" | "published" | "archived";
  parentId?: string | number;
  photoCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== PORTFOLIO (BRAND CURATION) ====================
export interface PortfolioItem {
  id?: string;
  photoId: string;
  photo?: Photo;
  sport: "athletics" | "volleyball" | "jiu-jitsu";
  caption?: string;
  isFeatured?: boolean;
  order?: number;
  createdAt?: Date;
}

// ==================== SERVICES ====================
export interface Service {
  id?: string;
  name: string;
  description: string;
  sport?: "athletics" | "volleyball" | "jiu-jitsu";
  whatsIncluded: string[];
  startingPrice: number;
  deliverables: string[];
  ctaLabel: string;
  ctaUrl?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt?: Date;
}

// ==================== SPORTS ====================
export interface Sport {
  id?: number;
  title: string;
  slug: string;
  summary?: string;
  imageUrl?: string;
  order?: number;
  createdAt?: Date;
}

// ==================== JOURNAL ====================
export interface JournalPost {
  id?: number;
  title: string;
  date: string;
  summary?: string;
  body?: string;
  imageUrl?: string;
  createdAt?: Date;
}

// ==================== CLIENTS (RELATIONSHIP TRACKING) ====================
export interface Client {
  id?: string;
  name: string;
  clientType?: "organization" | "athlete";
  contactPerson?: string;
  email?: string;
  phone?: string;
  logo?: string;
  website?: string;
  eventsCovered?: number;
  notes?: string;
  totalRevenue?: number;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==================== CONTENT (BRAND PAGES) ====================
export type ContentBlockType =
  | "hero"
  | "text"
  | "image"
  | "gallery"
  | "cta"
  | "faq"
  | "testimonial";

export interface ContentBlock {
  id?: string;
  type: ContentBlockType;
  order: number;
  data: Record<string, unknown>;
}

export interface ContentPage {
  id?: string;
  slug:
    | "home"
    | "about"
    | "sport-athletics"
    | "sport-volleyball"
    | "sport-jiu-jitsu"
    | "journal"
    | "faq";
  title: string;
  blocks: ContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: Date;
}

// ==================== SALES & REVENUE ====================
export interface RevenueEntry {
  id?: string;
  eventId?: string;
  clientId?: string;
  amount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  date: Date;
  notes?: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  downloadVolume: number;
  topEvent?: { eventId: string; amount: number };
  topSport?: { sport: string; amount: number };
}

// ==================== SETTINGS ====================
export interface PricingPreset {
  id?: string;
  name: string;
  basePrice: number;
  downloadBudget?: number;
  expirationDays?: number;
}

export interface BrandingSettings {
  siteName: string;
  primaryColor: string;
  accentColor: string;
  watermarkEnabled: boolean;
  watermarkUrl?: string;
  watermarkOpacity?: number;
}

export interface SiteSettings {
  id?: string;
  general?: {
    siteName: string;
    contactEmail?: string;
  };
  branding?: BrandingSettings;
  pricing?: PricingPreset[];
  gallery?: {
    defaultExpirationDays: number;
    defaultAllowDownload: boolean;
    notifyOnLive: boolean;
  };
  seo?: {
    metaDescription: string;
    shareImage?: string;
    keywords?: string[];
  };
  integrations?: {
    stripeKey?: string;
    sendgridKey?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  footerText: string;
  instagramHandle: string;
  instagramUrl: string;
  contactEmail: string;
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
}

// ==================== FORMS ====================
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  organization: string;
  service: "private-athlete" | "team" | "event" | "media" | "other";
  eventDate: string;
  message: string;
  submittedAt?: Date;
  status?: "new" | "reviewed" | "responded";
}
