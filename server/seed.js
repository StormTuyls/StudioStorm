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

// Users data (admin)
const usersData = [
  {
    id: 1,
    username: "admin",
    // Password: 'admin123' (change in production!)
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    createdAt: new Date(),
  },
];

// Client galleries data (examples)
const clientGalleriesData = [];

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
      console.log("✅ Cleared existing data");
    } catch (error) {
      console.log("Note: Collections might not exist yet");
    }

    // Insert data
    const photosResult = await db.collection("photos").insertMany(photosData);
    console.log(`✅ Inserted ${photosResult.insertedCount} photos`);

    const albumsResult = await db.collection("albums").insertMany(albumsData);
    console.log(`✅ Inserted ${albumsResult.insertedCount} albums`);

    const organizationsResult = await db
      .collection("organizations")
      .insertMany(organizationsData);
    console.log(
      `✅ Inserted ${organizationsResult.insertedCount} organizations`,
    );

    const usersResult = await db.collection("users").insertMany(usersData);
    console.log(`✅ Inserted ${usersResult.insertedCount} users`);

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
