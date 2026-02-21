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

// Services data
const servicesData = [
  {
    id: "svc-1",
    name: "Event Photography Package",
    description:
      "Complete coverage of your athletic event with professional editing",
    sport: "athletics",
    whatsIncluded: [
      "Full event coverage (4-8 hours)",
      "500+ photos edited",
      "Online gallery",
      "30-day access",
    ],
    startingPrice: 500,
    deliverables: [
      "Digital files (RAW + JPEG)",
      "4K video highlights",
      "Photo book option",
    ],
    ctaLabel: "Book Event Coverage",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 1,
    createdAt: new Date(),
  },
  {
    id: "svc-2",
    name: "Team Portrait Session",
    description: "Professional team photos for athletes and groups",
    sport: "athletics",
    whatsIncluded: [
      "1-2 hour session",
      "Outdoor or studio location",
      "50+ edited photos",
    ],
    startingPrice: 200,
    deliverables: [
      "Digital files",
      "Social media ready formats",
      "Unlimited usage rights",
    ],
    ctaLabel: "Book Portraits",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 2,
    createdAt: new Date(),
  },
  {
    id: "svc-3",
    name: "Volleyball Match Coverage",
    description: "Specialized photography for indoor volleyball competitions",
    sport: "volleyball",
    whatsIncluded: [
      "Complete match coverage",
      "200+ edited photos",
      "Instant online gallery",
    ],
    startingPrice: 350,
    deliverables: ["Digital files", "Video highlights reel"],
    ctaLabel: "Capture Your Match",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 3,
    createdAt: new Date(),
  },
  {
    id: "svc-4",
    name: "Jiu-Jitsu Tournament Shoot",
    description: "Detailed coverage of jiu-jitsu competitions and tournaments",
    sport: "jiu-jitsu",
    whatsIncluded: [
      "Full tournament coverage",
      "Individual match photos",
      "Athlete results sheet",
    ],
    startingPrice: 400,
    deliverables: ["Digital files", "Social media package"],
    ctaLabel: "Book Tournament",
    ctaUrl: "/contact",
    isActive: true,
    displayOrder: 4,
    createdAt: new Date(),
  },
];

// Portfolio items data (curated photos for each sport)
const portfolioData = [
  {
    id: "port-1",
    photoId: 1,
    sport: "athletics",
    caption: "Sprint finish at Belgian Championships",
    order: 1,
    createdAt: new Date(),
  },
  {
    id: "port-2",
    photoId: 2,
    sport: "athletics",
    caption: "Cross-country action shot",
    order: 2,
    createdAt: new Date(),
  },
  {
    id: "port-3",
    photoId: 4,
    sport: "athletics",
    caption: "Victory moment",
    order: 3,
    createdAt: new Date(),
  },
  {
    id: "port-4",
    photoId: 7,
    sport: "athletics",
    caption: "Street race finish line",
    order: 4,
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

// Clients data
const clientsData = [
  {
    id: "client-1",
    name: "Atletieknieuws",
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

    const portfolioResult = await db
      .collection("portfolio")
      .insertMany(portfolioData);
    console.log(`✅ Inserted ${portfolioResult.insertedCount} portfolio items`);

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
