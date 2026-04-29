import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:password123@localhost:27017/studio-storm?authSource=admin";

// Photo data
const photosData = [
  // Atletiek - BK Veldlopen
  {
    id: 1,
    title: "Sprintfinish BK Veldlopen",
    description:
      "De beslissende meters van de U23 categorie met een spannende sprint.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    dateTaken: "2025-12-15",
    location: "Brussel, België",
    camera: {
      model: "Canon EOS R3",
      iso: 3200,
      aperture: "f/2.8",
      shutterSpeed: "1/1000",
      focalLength: "200mm",
    },
    albumId: 101,
    width: 800,
    height: 600,
    isFeatured: true,
    likes: 142,
  },
  {
    id: 2,
    title: "Door de Modder",
    description:
      "Een loper die zich door de zware modder vecht tijdens het BK.",
    imageUrl:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    dateTaken: "2025-12-15",
    location: "Brussel, België",
    camera: {
      model: "Sony A1",
      iso: 2500,
      aperture: "f/2.8",
      shutterSpeed: "1/1250",
      focalLength: "300mm",
    },
    albumId: 101,
    width: 800,
    height: 1000,
    isFeatured: true,
    likes: 98,
  },
  {
    id: 3,
    title: "Kopgroep in Actie",
    description: "De kopgroep tijdens de eerste ronde van het parcours.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    dateTaken: "2025-12-15",
    location: "Brussel, België",
    camera: {
      model: "Nikon Z9",
      iso: 4000,
      aperture: "f/2.8",
      shutterSpeed: "1/1600",
      focalLength: "400mm",
    },
    albumId: 101,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 67,
  },
  {
    id: 4,
    title: "Juichende Kampioen",
    description: "De emotie na het winnen van de Belgische titel.",
    imageUrl:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    dateTaken: "2025-12-15",
    location: "Brussel, België",
    camera: {
      model: "Canon EOS R3",
      iso: 1600,
      aperture: "f/4",
      shutterSpeed: "1/500",
      focalLength: "70mm",
    },
    albumId: 101,
    width: 800,
    height: 600,
    isFeatured: true,
    likes: 203,
  },
  {
    id: 5,
    title: "Start Dwars door Vlaanderen",
    description:
      "Het startschot voor de 10km straatloop met honderden deelnemers.",
    imageUrl:
      "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800",
    dateTaken: "2026-01-20",
    location: "Roeselare, België",
    camera: {
      model: "Sony A1",
      iso: 5000,
      aperture: "f/2.8",
      shutterSpeed: "1/1000",
      focalLength: "135mm",
    },
    albumId: 102,
    width: 800,
    height: 1200,
    isFeatured: false,
    likes: 54,
  },
  {
    id: 6,
    title: "Door de Straten",
    description: "Lopers die door de historische binnenstad razen.",
    imageUrl:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
    dateTaken: "2026-01-20",
    location: "Roeselare, België",
    camera: {
      model: "Canon EOS R3",
      iso: 6400,
      aperture: "f/2.8",
      shutterSpeed: "1/800",
      focalLength: "200mm",
    },
    albumId: 102,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 78,
  },
  {
    id: 7,
    title: "Finishline Sprint",
    description: "De laatste meters naar de finish met volle inzet.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    dateTaken: "2026-01-20",
    location: "Roeselare, België",
    camera: {
      model: "Nikon Z9",
      iso: 4000,
      aperture: "f/2.8",
      shutterSpeed: "1/1250",
      focalLength: "300mm",
    },
    albumId: 102,
    width: 800,
    height: 600,
    isFeatured: true,
    likes: 187,
  },
  {
    id: 8,
    title: "Publiek Steunt Aan",
    description:
      "Enthousiaste supporters langs de kant moedigen de lopers aan.",
    imageUrl:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    dateTaken: "2026-01-20",
    location: "Roeselare, België",
    camera: {
      model: "Canon EOS R3",
      iso: 2000,
      aperture: "f/2.8",
      shutterSpeed: "1/2000",
      focalLength: "400mm",
    },
    albumId: 102,
    width: 800,
    height: 1000,
    isFeatured: false,
    likes: 91,
  },
  {
    id: 9,
    title: "100m Finale",
    description:
      "De explosieve start van de 100 meter finale op de Diamond League.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    dateTaken: "2025-09-05",
    location: "Brussel, België",
    camera: {
      model: "Sony A1",
      iso: 1600,
      aperture: "f/2.8",
      shutterSpeed: "1/1600",
      focalLength: "300mm",
    },
    albumId: 103,
    width: 800,
    height: 1000,
    isFeatured: true,
    likes: 256,
  },
  {
    id: 10,
    title: "Hoogspringen",
    description: "Een atleet die over de lat zweeft tijdens het hoogspringen.",
    imageUrl:
      "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800",
    dateTaken: "2025-09-05",
    location: "Brussel, België",
    camera: {
      model: "Canon EOS R3",
      iso: 3200,
      aperture: "f/2.8",
      shutterSpeed: "1/2000",
      focalLength: "200mm",
    },
    albumId: 103,
    width: 800,
    height: 1200,
    isFeatured: false,
    likes: 134,
  },
  {
    id: 11,
    title: "Estafette Wissel",
    description: "Het cruciale moment van de stokwissel tijdens de 4x100m.",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
    dateTaken: "2025-09-05",
    location: "Brussel, België",
    camera: {
      model: "Nikon Z9",
      iso: 5000,
      aperture: "f/2.8",
      shutterSpeed: "1/1250",
      focalLength: "400mm",
    },
    albumId: 103,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 112,
  },
  {
    id: 12,
    title: "Vol Stadion",
    description: "Het Koning Boudewijnstadion gevuld met duizenden supporters.",
    imageUrl:
      "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
    dateTaken: "2025-09-05",
    location: "Brussel, België",
    camera: {
      model: "Canon EOS R3",
      iso: 800,
      aperture: "f/5.6",
      shutterSpeed: "1/500",
      focalLength: "24mm",
    },
    albumId: 103,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 45,
  },
  {
    id: 13,
    title: "Krachtige Smash",
    description: "Een speler die met volle kracht de bal naar beneden slaat.",
    imageUrl:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    dateTaken: "2025-11-18",
    location: "Gent, België",
    camera: {
      model: "Sony A1",
      iso: 5000,
      aperture: "f/2.8",
      shutterSpeed: "1/1000",
      focalLength: "135mm",
    },
    albumId: 201,
    width: 800,
    height: 1200,
    isFeatured: true,
    likes: 165,
  },
  {
    id: 14,
    title: "Blok aan het Net",
    description: "Twee spelers die gezamenlijk een blok vormen aan het net.",
    imageUrl:
      "https://images.unsplash.com/photo-1593786481097-080e77c6ce04?w=800",
    dateTaken: "2025-11-18",
    location: "Gent, België",
    camera: {
      model: "Canon EOS R3",
      iso: 6400,
      aperture: "f/2.8",
      shutterSpeed: "1/800",
      focalLength: "200mm",
    },
    albumId: 201,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 89,
  },
  {
    id: 15,
    title: "Duik naar de Bal",
    description: "Een spectaculaire duik om de bal nog net te kunnen raken.",
    imageUrl:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    dateTaken: "2025-11-18",
    location: "Gent, België",
    camera: {
      model: "Nikon Z9",
      iso: 4000,
      aperture: "f/2.8",
      shutterSpeed: "1/1250",
      focalLength: "300mm",
    },
    albumId: 201,
    width: 800,
    height: 600,
    isFeatured: true,
    likes: 221,
  },
  {
    id: 16,
    title: "Teamviering",
    description: "Het team viert een gewonnen set met een groepsknuffel.",
    imageUrl:
      "https://images.unsplash.com/photo-1593786481097-080e77c6ce04?w=800",
    dateTaken: "2025-11-18",
    location: "Gent, België",
    camera: {
      model: "Canon EOS R3",
      iso: 3200,
      aperture: "f/2.8",
      shutterSpeed: "1/500",
      focalLength: "85mm",
    },
    albumId: 201,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 73,
  },
  {
    id: 17,
    title: "Worpgreep",
    description:
      "Het moment waarop een judoka zijn tegenstander optilt voor een worp.",
    imageUrl: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800",
    dateTaken: "2024-03-12",
    location: "Antwerpen, België",
    camera: {
      model: "Canon EOS R3",
      iso: 3200,
      aperture: "f/2.8",
      shutterSpeed: "1/1000",
      focalLength: "200mm",
    },
    albumId: 3,
    width: 800,
    height: 1000,
    isFeatured: false,
    likes: 56,
  },
  {
    id: 18,
    title: "Grondgevecht",
    description: "Intense grondtechnieken tijdens een wedstrijd.",
    imageUrl:
      "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=800",
    dateTaken: "2024-03-12",
    location: "Antwerpen, België",
    camera: {
      model: "Sony A1",
      iso: 5000,
      aperture: "f/2.8",
      shutterSpeed: "1/800",
      focalLength: "135mm",
    },
    albumId: 3,
    width: 800,
    height: 600,
    isFeatured: false,
    likes: 38,
  },
];

// Album data
const albumsData = [
  {
    id: 1,
    name: "Atletiek",
    slug: "atletiek",
    description: "Loopwedstrijden, veldloop, piste - de dynamiek van atletiek",
    coverPhotoId: 1,
    photoCount: 12,
  },
  {
    id: 2,
    name: "Volleybal",
    slug: "volleybal",
    description: "Spannende momenten van de volleybalcourt",
    coverPhotoId: 13,
    photoCount: 4,
  },
  {
    id: 3,
    name: "Jiu-Jitsu",
    slug: "jiu-jitsu",
    description: "Krachtige momenten uit de vechtsport",
    coverPhotoId: 17,
    photoCount: 2,
  },
  {
    id: 101,
    name: "BK Veldlopen 2025",
    slug: "atletiek/bk-veldlopen-2025",
    description: "Belgisch Kampioenschap Veldlopen - Brussel",
    coverPhotoId: 1,
    photoCount: 4,
    parentId: 1,
  },
  {
    id: 102,
    name: "Dwars door Vlaanderen 2026",
    slug: "atletiek/dwars-door-vlaanderen-2026",
    description: "Straatloop door de straten van Roeselare",
    coverPhotoId: 5,
    photoCount: 4,
    parentId: 1,
  },
  {
    id: 103,
    name: "Memorial Van Damme 2025",
    slug: "atletiek/memorial-van-damme-2025",
    description: "Diamond League meeting in Brussel",
    coverPhotoId: 9,
    photoCount: 4,
    parentId: 1,
  },
  {
    id: 201,
    name: "Beker van België 2025",
    slug: "volleybal/beker-van-belgie-2025",
    description: "Halve finale in Gent",
    coverPhotoId: 13,
    photoCount: 4,
    parentId: 2,
  },
];

// Users data (admin + demo client)
const usersData = [
  {
    id: 1,
    username: "admin",
    email: "admin@studiostorm.sports",
    firstName: "Admin",
    lastName: "Studio Storm",
    // Password: 'admin123' (change in production!)
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    createdAt: new Date(),
    lastLogin: null,
  },
  {
    id: 2,
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    // Password: 'client123'
    passwordHash: bcrypt.hashSync("client123", 10),
    role: "client",
    createdAt: new Date(),
    lastLogin: null,
  },
];

// Client galleries data (examples)
const clientGalleriesData = [
  {
    id: 1,
    clientName: "John Doe - Athletics 2025",
    description: "Your personal photos from the athletics championship",
    uniqueUrl: "sample-gallery-athletics-2025",
    userId: 2, // Assigned to John Doe
    isProtected: true,
    password: "demo123",
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    allowDownload: true,
    photos: [
      {
        id: 1001,
        title: "Finish Line Action",
        description: "Crossing the finish line with great form",
        imageUrl:
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
        uploadedAt: new Date(),
        likes: 15,
      },
      {
        id: 1002,
        title: "Warming Up",
        description: "Pre-race warmup session",
        imageUrl:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
        uploadedAt: new Date(),
        likes: 8,
      },
      {
        id: 1003,
        title: "Victory Celebration",
        description: "Celebrating after a great performance",
        imageUrl:
          "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800",
        uploadedAt: new Date(),
        likes: 22,
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 2,
    clientName: "Public Event - Sports Day 2025",
    description: "Open gallery for all participants",
    uniqueUrl: "public-event-2025",
    userId: null, // Not assigned to any user
    isProtected: false,
    password: null,
    expiresAt: null,
    allowDownload: true,
    photos: [
      {
        id: 2001,
        title: "Team Group Photo",
        description: "All participants together",
        imageUrl:
          "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
        uploadedAt: new Date(),
        likes: 45,
      },
      {
        id: 2002,
        title: "Awards Ceremony",
        description: "Medal presentation",
        imageUrl:
          "https://images.unsplash.com/photo-1527871454777-032ec3f75d31?w=800",
        uploadedAt: new Date(),
        likes: 38,
      },
    ],
    createdAt: new Date(),
  },
];

// Organizations data
const organizationsData = [
  {
    id: 1,
    name: "Atletieknieuws",
    website: "https://atletieknieuws.be",
    description: "Belgisch atletieknieuwsplatform",
  },
  {
    id: 2,
    name: "Agones Media",
    website: "https://agonesmedia.com",
    description: "Media partner voor sportgebeurtenissen",
  },
  {
    id: 3,
    name: "Runnerslab Athletics Team",
    website: "https://runnerslab.be",
    description: "Atletiekteam en sponsor",
  },
  {
    id: 4,
    name: "VAL - Vlaamse Atletiekliga",
    website: "https://vlaamse-atletiekliga.be",
    description: "Vlaamse atletiek competitie",
  },
];

// Update albums to include sport field
const updatedAlbumsData = albumsData.map((album) => ({
  ...album,
  sport:
    album.parentId === 1
      ? "athletics"
      : album.parentId === 2
        ? "athletics"
        : "other",
  visibility: "public",
  revenue: 0,
  status: "published",
}));

// Services data (from public site copy)
const servicesData = [
  {
    id: "svc-private-athlete",
    name: "Private Athlete",
    description: "Personal branding for elite competitors.",
    sport: "athletics",
    whatsIncluded: [
      "Pre-shoot planning call",
      "1.5 hour focused session",
      "20 curated high-res images",
      "Custom color grading",
    ],
    startingPrice: 600,
    deliverables: [
      "Personal branding + sponsor kits",
      "Web + social delivery",
      "High-res download",
    ],
    ctaLabel: "Request Availability",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 1,
    createdAt: new Date(),
  },
  {
    id: "svc-team-media-day",
    name: "Team Media Day",
    description: "Cohesive visuals for clubs and federations.",
    sport: "volleyball",
    whatsIncluded: [
      "On-location studio setup",
      "Individual athlete portraits",
      "Team and group visuals",
      "Social-ready cutdowns",
    ],
    startingPrice: 1800,
    deliverables: [
      "Club media + sponsor assets",
      "Press-ready cutdowns",
      "High-res download",
    ],
    ctaLabel: "Request Availability",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 2,
    createdAt: new Date(),
  },
  {
    id: "svc-competition-coverage",
    name: "Competition Coverage",
    description: "Full-event storytelling for meets and tournaments.",
    sport: "athletics",
    whatsIncluded: [
      "Full-event coverage",
      "Highlight edit + live selects",
      "Delivery by event + discipline",
      "Optional on-site upload",
    ],
    startingPrice: 2400,
    deliverables: ["Event marketing + press", "Sponsor-ready delivery"],
    ctaLabel: "Request Availability",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 3,
    createdAt: new Date(),
  },
];

// Sports data (from public site)
const sportsData = [
  {
    id: 1,
    title: "Atletiek",
    slug: "atletiek",
    summary: "Explosive starts, clean form, raw emotion.",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1500&auto=format&fit=crop",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Volleybal",
    slug: "volleybal",
    summary: "Vertical movement and teamwork under pressure.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1500&auto=format&fit=crop",
    order: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Jiu-Jitsu",
    slug: "jiu-jitsu",
    summary: "Close-range intensity, captured with clarity.",
    imageUrl:
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1500&auto=format&fit=crop",
    order: 3,
    createdAt: new Date(),
  },
];

// Portfolio items data (curated photos for each sport)
const portfolioData = [
  {
    id: "port-1",
    photoId: 1,
    sport: "atletiek",
    caption: "Sprint finish at Belgian Championships",
    order: 1,
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "port-2",
    photoId: 2,
    sport: "atletiek",
    caption: "Cross-country action shot",
    order: 2,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: "port-3",
    photoId: 4,
    sport: "atletiek",
    caption: "Victory moment",
    order: 3,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: "port-4",
    photoId: 13,
    sport: "volleybal",
    caption: "Powerful smash sequence",
    order: 4,
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: "port-5",
    photoId: 15,
    sport: "volleybal",
    caption: "Defensive dive highlight",
    order: 5,
    isFeatured: false,
    createdAt: new Date(),
  },
  {
    id: "port-6",
    photoId: 17,
    sport: "jiu-jitsu",
    caption: "Grip exchange under pressure",
    order: 6,
    isFeatured: true,
    createdAt: new Date(),
  },
];

// About content data (from public site)
const aboutContentData = {
  id: 1,
  title: "Studio Storm is built on athletics-first storytelling.",
  image:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
  paragraphs: [
    "We focus on the edge of performance: the calm before the gun, the drive phase, the finish, and the moments in between. Our work is trusted by clubs and media partners who want clarity and prestige without the noise.",
    "With a primary focus on athletics, and additional coverage in volleyball and jiu-jitsu, we create imagery that feels editorial and timeless while staying true to the sport.",
    "Studio Storm partners with Atletieknieuws, Agones Media, Runnerslab Athletics Team, and VAL, delivering consistent coverage across seasons.",
  ],
  specializations: [
    {
      name: "Focus",
      subtitle: "Athletics-first.",
      description: "Speed, precision, and the emotional finish.",
    },
    {
      name: "Style",
      subtitle: "Clean and cinematic.",
      description: "Minimal UI, strong typography, and generous spacing.",
    },
    {
      name: "Delivery",
      subtitle: "Fast, curated edits.",
      description: "Organized and ready for media or sponsors.",
    },
  ],
  contactText: "Interesse in sportfotografie? Neem contact op via",
  contactLinkText: "@studiostorm.sports",
  contactLinkUrl: "https://instagram.com/studiostorm.sports",
  contactSuffix: "op Instagram of via ons contactformulier.",
  updatedAt: new Date(),
};

// Journal posts data (from public site)
const journalData = [
  {
    id: 1,
    title: "BK Veldlopen 2026 - Highlights",
    date: "2026-02",
    summary: "A focused selection of the most decisive frames from the course.",
    body: "",
    imageUrl: "",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "How to Prepare for Competition Photos",
    date: "2026-01",
    summary: "What athletes and clubs can do to elevate event coverage.",
    body: "",
    imageUrl: "",
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Capturing Finals Under Pressure",
    date: "2025-12",
    summary: "Timing, positioning, and calm execution when everything is on.",
    body: "",
    imageUrl: "",
    createdAt: new Date(),
  },
];

// Content pages data
const contentPagesData = [
  {
    id: "page-home",
    slug: "home",
    title: "Homepage",
    blocks: [
      {
        id: "blk-hero",
        type: "hero",
        order: 0,
        data: {
          title: "Capture Your Athletic Excellence",
          subtitle:
            "Professional sports photography for athletes, teams, and events",
          backgroundImage:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200",
        },
      },
    ],
    seoTitle: "Studio Storm | Professional Sports Photography",
    seoDescription:
      "Award-winning sports photography specializing in athletics, volleyball, and jiu-jitsu",
    updatedAt: new Date(),
  },
  {
    id: "page-about",
    slug: "about",
    title: "About",
    blocks: [
      {
        id: "blk-text",
        type: "text",
        order: 0,
        data: {
          content:
            "Studio Storm is a professional sports photography studio based in Belgium, specializing in athletic events and competitions.",
        },
      },
    ],
    seoTitle: "About Studio Storm",
    seoDescription: "Learn about our studio and photography philosophy",
    updatedAt: new Date(),
  },
  {
    id: "page-athletics",
    slug: "sport-athletics",
    title: "Athletics",
    blocks: [],
    seoTitle: "Athletics Photography | Studio Storm",
    seoDescription: "Professional photography for track and field events",
    updatedAt: new Date(),
  },
  {
    id: "page-volleyball",
    slug: "sport-volleyball",
    title: "Volleyball",
    blocks: [],
    seoTitle: "Volleyball Photography | Studio Storm",
    seoDescription: "Indoor volleyball match and tournament coverage",
    updatedAt: new Date(),
  },
  {
    id: "page-jiu-jitsu",
    slug: "sport-jiu-jitsu",
    title: "Jiu-Jitsu",
    blocks: [],
    seoTitle: "Jiu-Jitsu Photography | Studio Storm",
    seoDescription: "Professional coverage of jiu-jitsu competitions",
    updatedAt: new Date(),
  },
  {
    id: "page-journal",
    slug: "journal",
    title: "Journal",
    blocks: [],
    seoTitle: "Journal | Studio Storm",
    seoDescription: "Photography insights and behind-the-scenes stories",
    updatedAt: new Date(),
  },
  {
    id: "page-faq",
    slug: "faq",
    title: "FAQ",
    blocks: [
      {
        id: "blk-faq-1",
        type: "faq",
        order: 0,
        data: {
          question: "How long does editing take?",
          answer: "Typically 3-5 business days depending on event size",
        },
      },
      {
        id: "blk-faq-2",
        type: "faq",
        order: 1,
        data: {
          question: "Can I use photos for commercial purposes?",
          answer: "Yes, commercial usage rights are included in all packages",
        },
      },
    ],
    seoTitle: "FAQ | Studio Storm",
    seoDescription: "Frequently asked questions about our services",
    updatedAt: new Date(),
  },
];

// Home settings data (hero image & highlights gallery)
const homeSettingsData = {
  id: "home-settings",
  heroImageUrl:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1900&auto=format&fit=crop",
  heroImageTitle: "Iconic sports moment",
  highlights: [
    {
      id: "hl-1",
      title: "Finish Line Burst",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&fit=crop",
      order: 1,
    },
    {
      id: "hl-2",
      title: "Relay Handoff",
      imageUrl:
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1400&auto=format&fit=crop",
      order: 2,
    },
    {
      id: "hl-3",
      title: "Arena Silence",
      imageUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&auto=format&fit=crop",
      order: 3,
    },
    {
      id: "hl-4",
      title: "Explosive Jump",
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&auto=format&fit=crop",
      order: 4,
    },
    {
      id: "hl-5",
      title: "Volley Rise",
      imageUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&auto=format&fit=crop",
      order: 5,
    },
    {
      id: "hl-6",
      title: "Serve Pressure",
      imageUrl:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&auto=format&fit=crop",
      order: 6,
    },
    {
      id: "hl-7",
      title: "Grip Fight",
      imageUrl:
        "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1400&auto=format&fit=crop",
      order: 7,
    },
    {
      id: "hl-8",
      title: "Final Seconds",
      imageUrl:
        "https://images.unsplash.com/photo-1544717302-de2939b7efcb?w=1400&auto=format&fit=crop",
      order: 8,
    },
    {
      id: "hl-9",
      title: "Victory Break",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&fit=crop",
      order: 9,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Clients data
const clientsData = [
  {
    id: "client-1",
    name: "Atletieknieuws",
    clientType: "organization",
    contactPerson: "Jan Smeets",
    email: "contact@atletieknieuws.be",
    phone: "+32 123 456 789",
    website: "https://atletieknieuws.be",
    eventsCovered: 12,
    totalRevenue: 5400,
    featured: true,
    notes: "Regular media partner, covers Belgian championships",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-2",
    name: "Agones Media",
    clientType: "organization",
    contactPerson: "Sophie Dupont",
    email: "booking@agonesmedia.com",
    phone: "+32 987 654 321",
    website: "https://agonesmedia.com",
    eventsCovered: 8,
    totalRevenue: 3200,
    featured: true,
    notes: "Sports media agency, international events",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-3",
    name: "Runnerslab Athletics Team",
    clientType: "organization",
    contactPerson: "Marco Russo",
    email: "info@runnerslab.be",
    phone: "+32 456 789 012",
    website: "https://runnerslab.be",
    eventsCovered: 6,
    totalRevenue: 1800,
    featured: true,
    notes: "Team events and training sessions",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-4",
    name: "VAL - Vlaamse Atletiekliga",
    clientType: "organization",
    contactPerson: "Kris Van den Berg",
    email: "fotografie@val.be",
    phone: "+32 321 654 987",
    website: "https://vlaamse-atletiekliga.be",
    eventsCovered: 24,
    totalRevenue: 8600,
    featured: true,
    notes: "Official athletics league, recurring events",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-5",
    name: "Elena Verbeek",
    clientType: "athlete",
    contactPerson: "Elena Verbeek",
    email: "elena.verbeek@example.com",
    phone: "+32 444 221 987",
    eventsCovered: 2,
    totalRevenue: 600,
    featured: false,
    notes: "800m specialist, personal branding session",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-6",
    name: "Jonas De Smet",
    clientType: "athlete",
    contactPerson: "Jonas De Smet",
    email: "jonas.desmet@example.com",
    phone: "+32 477 110 554",
    eventsCovered: 1,
    totalRevenue: 450,
    featured: false,
    notes: "Sprinter media kit",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("studio-storm");

    // Drop existing collections
    try {
      await db.collection("photos").deleteMany({});
      await db.collection("albums").deleteMany({});
      await db.collection("organizations").deleteMany({});
      await db.collection("users").deleteMany({});
      await db.collection("clientGalleries").deleteMany({});
      await db.collection("likes").deleteMany({});
      await db.collection("galleryLikes").deleteMany({});
      await db.collection("services").deleteMany({});
      await db.collection("portfolio").deleteMany({});
      await db.collection("contentPages").deleteMany({});
      await db.collection("clients").deleteMany({});
      await db.collection("sports").deleteMany({});
      await db.collection("journal").deleteMany({});
      await db.collection("aboutContent").deleteMany({});
      await db.collection("homeSettings").deleteMany({});
      console.log("✅ Cleared existing data");
    } catch (error) {
      console.log("Note: Collections might not exist yet");
    }

    // Insert data
    const photosResult = await db.collection("photos").insertMany(photosData);
    console.log(`✅ Inserted ${photosResult.insertedCount} photos`);

    const albumsResult = await db
      .collection("albums")
      .insertMany(updatedAlbumsData);
    console.log(
      `✅ Inserted ${albumsResult.insertedCount} albums with sport field`,
    );

    const organizationsResult = await db
      .collection("organizations")
      .insertMany(organizationsData);
    console.log(
      `✅ Inserted ${organizationsResult.insertedCount} organizations`,
    );

    const usersResult = await db.collection("users").insertMany(usersData);
    console.log(`✅ Inserted ${usersResult.insertedCount} users`);

    const clientGalleriesResult = await db
      .collection("clientGalleries")
      .insertMany(clientGalleriesData);
    console.log(
      `✅ Inserted ${clientGalleriesResult.insertedCount} client galleries`,
    );

    // Insert new collections
    const servicesResult = await db
      .collection("services")
      .insertMany(servicesData);
    console.log(`✅ Inserted ${servicesResult.insertedCount} services`);

    const sportsResult = await db.collection("sports").insertMany(sportsData);
    console.log(`✅ Inserted ${sportsResult.insertedCount} sports`);

    const portfolioResult = await db
      .collection("portfolio")
      .insertMany(portfolioData);
    console.log(`✅ Inserted ${portfolioResult.insertedCount} portfolio items`);

    const aboutResult = await db
      .collection("aboutContent")
      .insertOne(aboutContentData);
    console.log(`✅ Inserted about content (${aboutResult.insertedId})`);

    const journalResult = await db
      .collection("journal")
      .insertMany(journalData);
    console.log(`✅ Inserted ${journalResult.insertedCount} journal posts`);

    const contentPagesResult = await db
      .collection("contentPages")
      .insertMany(contentPagesData);
    console.log(
      `✅ Inserted ${contentPagesResult.insertedCount} content pages`,
    );

    const clientsResult = await db
      .collection("clients")
      .insertMany(clientsData);
    console.log(`✅ Inserted ${clientsResult.insertedCount} clients`);

    const homeSettingsResult = await db
      .collection("homeSettings")
      .insertOne(homeSettingsData);
    console.log(`✅ Inserted home settings (${homeSettingsResult.insertedId})`);

    // Create indexes for better performance
    await db
      .collection("likes")
      .createIndex({ photoId: 1, identifier: 1 }, { unique: true });
    await db
      .collection("galleryLikes")
      .createIndex(
        { uniqueUrl: 1, photoId: 1, identifier: 1 },
        { unique: true },
      );
    console.log("✅ Created indexes");

    console.log("\n🌱 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
