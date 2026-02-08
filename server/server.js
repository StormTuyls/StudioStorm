import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken, generateToken } from "./middleware/auth.js";
import { upload } from "./middleware/upload.js";
import { extractExifData } from "./utils/exif.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://admin:password123@localhost:27017/studio-storm?authSource=admin";

let db;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting for like endpoint
const likeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 likes per hour
  message: "Too many like requests, please try again later.",
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many like requests, please try again later.",
      retryAfter: req.rateLimit?.resetTime
        ? new Date(req.rateLimit.resetTime).toISOString()
        : null,
    });
  },
  skip: (req, res) => false,
  keyGenerator: (req) => {
    // Use IP address for rate limiting
    return req.ip || req.socket?.remoteAddress || "unknown";
  },
});

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("studio-storm");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Routes

// GET all photos
app.get("/api/photos", async (req, res) => {
  try {
    const photos = await db.collection("photos").find({}).toArray();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET photo by ID
app.get("/api/photos/:id", async (req, res) => {
  try {
    const photo = await db
      .collection("photos")
      .findOne({ id: Number(req.params.id) });
    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET featured photos
app.get("/api/photos/featured/list", async (req, res) => {
  try {
    const photos = await db
      .collection("photos")
      .find({ isFeatured: true })
      .sort({ likes: -1 })
      .toArray();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET photos by album
app.get("/api/albums/:albumId/photos", async (req, res) => {
  try {
    const photos = await db
      .collection("photos")
      .find({ albumId: Number(req.params.albumId) })
      .toArray();
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all albums
app.get("/api/albums", async (req, res) => {
  try {
    const albums = await db.collection("albums").find({}).toArray();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET main albums only
app.get("/api/albums/main", async (req, res) => {
  try {
    const albums = await db
      .collection("albums")
      .find({ parentId: { $exists: false } })
      .toArray();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET album by slug (supports nested slugs like atletiek/bk-veldlopen-2025)
app.get("/api/albums/slug/*", async (req, res) => {
  try {
    // Extract slug from the URL path after /api/albums/slug/
    const slug = req.params[0];
    const album = await db.collection("albums").findOne({ slug: slug });
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET album by ID
app.get("/api/albums/:id", async (req, res) => {
  try {
    const album = await db
      .collection("albums")
      .findOne({ id: Number(req.params.id) });
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET subalbums by parent ID
app.get("/api/albums/:parentId/subalbums", async (req, res) => {
  try {
    const subalbums = await db
      .collection("albums")
      .find({ parentId: Number(req.params.parentId) })
      .toArray();
    res.json(subalbums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all organizations
app.get("/api/organizations", async (req, res) => {
  try {
    const organizations = await db
      .collection("organizations")
      .find({})
      .toArray();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH like/unlike photo - Optimized toggle system
app.patch("/api/photos/:id/like", likeLimiter, async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const identifier = req.ip || req.connection.remoteAddress;

    // Check if this identifier has already liked this photo
    const existingLike = await db
      .collection("likes")
      .findOne({ photoId, identifier });

    let isLiked;
    let increment;

    if (existingLike) {
      // Unlike: Remove the like
      await db.collection("likes").deleteOne({
        photoId,
        identifier,
      });
      isLiked = false;
      increment = -1;
    } else {
      // Like: Add the like
      await db.collection("likes").insertOne({
        photoId,
        identifier,
        timestamp: new Date(),
      });
      isLiked = true;
      increment = 1;
    }

    // Update like count
    await db
      .collection("photos")
      .updateOne({ id: photoId }, { $inc: { likes: increment } });

    const updatedPhoto = await db.collection("photos").findOne({ id: photoId });
    const updatedLikes = Math.max(0, updatedPhoto?.likes || 0);

    res.json({
      likes: updatedLikes,
      isLiked,
      photoId,
    });
  } catch (error) {
    console.error("Like error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUTHENTICATION ====================

// POST login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .findOne({ id: req.user.id }, { projection: { passwordHash: 0 } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// PHOTOS CRUD

// POST create photo
app.post(
  "/api/admin/photos",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("📤 Upload request received");
      console.log(
        "File:",
        req.file
          ? `${req.file.originalname} (${req.file.size} bytes)`
          : "No file",
      );
      console.log("Body:", req.body);

      const { title, description, location, albumId, camera, dateTaken } =
        req.body;

      // Validate required fields
      if (!title) {
        console.warn("❌ Title missing");
        return res.status(400).json({ error: "Title is required" });
      }

      if (!req.file) {
        console.warn("❌ No file uploaded");
        return res.status(400).json({ error: "No image file provided" });
      }

      // Get next photo ID
      const lastPhoto = await db
        .collection("photos")
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      const nextId = lastPhoto.length > 0 ? lastPhoto[0].id + 1 : 1;
      console.log(`✅ Next photo ID: ${nextId}`);

      // Build full image URL with server host and port
      const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
      const imageUrl = req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : req.body.imageUrl;

      console.log(`📸 Image URL: ${imageUrl}`);

      // Extract EXIF data if image file was uploaded
      let extractedMetadata = {
        camera: camera
          ? JSON.parse(camera)
          : { model: "Unknown", make: "Unknown" },
        lens: "Unknown",
        iso: 0,
        aperture: "N/A",
        shutterSpeed: "N/A",
        focalLength: "N/A",
        dateTaken: dateTaken || new Date().toISOString().split("T")[0],
      };

      if (req.file) {
        const filePath = req.file.path;
        console.log(`🔍 Extracting EXIF from: ${filePath}`);
        const exifData = extractExifData(filePath);
        console.log(`📋 EXIF Data:`, exifData);

        // Merge extracted data with user-provided data (user data takes precedence)
        extractedMetadata = {
          camera: camera
            ? JSON.parse(camera)
            : {
                model: exifData.camera.model,
                make: exifData.camera.make,
              },
          lens: exifData.lens || "Unknown",
          iso: exifData.iso || 0,
          aperture: exifData.aperture || "N/A",
          shutterSpeed: exifData.shutterSpeed || "N/A",
          focalLength: exifData.focalLength || "N/A",
          dateTaken:
            dateTaken ||
            exifData.dateTaken ||
            new Date().toISOString().split("T")[0],
        };
      }

      const newPhoto = {
        id: nextId,
        title,
        description: description || "",
        imageUrl,
        dateTaken: extractedMetadata.dateTaken,
        location: location || "",
        camera: extractedMetadata.camera,
        lens: extractedMetadata.lens,
        iso: extractedMetadata.iso,
        aperture: extractedMetadata.aperture,
        shutterSpeed: extractedMetadata.shutterSpeed,
        focalLength: extractedMetadata.focalLength,
        albumId: albumId ? Number(albumId) : null,
        width: 800,
        height: 600,
        isFeatured: false,
        likes: 0,
        createdAt: new Date(),
      };

      console.log(`💾 Inserting photo:`, newPhoto);
      await db.collection("photos").insertOne(newPhoto);
      console.log(`✅ Photo saved successfully! ID: ${nextId}`);

      res.status(201).json(newPhoto);
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  },
);

// PATCH update photo
app.patch("/api/admin/photos/:id", authenticateToken, async (req, res) => {
  try {
    const photoId = Number(req.params.id);
    const updates = req.body;

    // Remove _id if present
    delete updates._id;

    // Convert albumId if present
    if (updates.albumId) {
      updates.albumId = Number(updates.albumId);
    }

    await db.collection("photos").updateOne({ id: photoId }, { $set: updates });

    const updatedPhoto = await db.collection("photos").findOne({ id: photoId });
    res.json(updatedPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE photo
app.delete("/api/admin/photos/:id", authenticateToken, async (req, res) => {
  try {
    const result = await db
      .collection("photos")
      .deleteOne({ id: Number(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.json({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ALBUMS CRUD

// POST create album
app.post("/api/admin/albums", authenticateToken, async (req, res) => {
  try {
    const { name, slug, description, coverPhotoId, parentId } = req.body;

    // Get next album ID
    const lastAlbum = await db
      .collection("albums")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const nextId = lastAlbum.length > 0 ? lastAlbum[0].id + 1 : 1;

    const newAlbum = {
      id: nextId,
      name,
      slug,
      description,
      coverPhotoId: coverPhotoId ? Number(coverPhotoId) : null,
      photoCount: 0,
      ...(parentId && { parentId: Number(parentId) }),
    };

    await db.collection("albums").insertOne(newAlbum);
    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update album
app.patch("/api/admin/albums/:id", authenticateToken, async (req, res) => {
  try {
    const albumId = Number(req.params.id);
    const updates = req.body;

    delete updates._id;

    if (updates.coverPhotoId) {
      updates.coverPhotoId = Number(updates.coverPhotoId);
    }
    if (updates.parentId) {
      updates.parentId = Number(updates.parentId);
    }

    await db.collection("albums").updateOne({ id: albumId }, { $set: updates });

    const updatedAlbum = await db.collection("albums").findOne({ id: albumId });
    res.json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE album
app.delete("/api/admin/albums/:id", authenticateToken, async (req, res) => {
  try {
    const result = await db
      .collection("albums")
      .deleteOne({ id: Number(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CLIENT GALLERIES ====================

// POST create client gallery
app.post("/api/admin/client-galleries", authenticateToken, async (req, res) => {
  try {
    const { clientName, description } = req.body;
    const uniqueUrl = uuidv4();

    const newGallery = {
      id: Date.now(),
      clientName,
      description,
      uniqueUrl,
      photos: [],
      createdAt: new Date(),
      expiresAt: null,
    };

    await db.collection("clientGalleries").insertOne(newGallery);
    res.status(201).json(newGallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all client galleries (admin)
app.get("/api/admin/client-galleries", authenticateToken, async (req, res) => {
  try {
    const galleries = await db
      .collection("clientGalleries")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST upload photo to client gallery
app.post(
  "/api/admin/client-galleries/:id/photos",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const galleryId = Number(req.params.id);
      const { title, description } = req.body;

      // Build full image URL with server host and port
      const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
      const imageUrl = req.file
        ? `${baseUrl}/uploads/${req.file.filename}`
        : null;

      if (!imageUrl) {
        return res.status(400).json({ error: "Image file required" });
      }

      const photoData = {
        id: Date.now(),
        title: title || req.file.originalname,
        description: description || "",
        imageUrl,
        uploadedAt: new Date(),
        likes: 0,
      };

      await db
        .collection("clientGalleries")
        .updateOne({ id: galleryId }, { $push: { photos: photoData } });

      res.status(201).json(photoData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// DELETE client gallery
app.delete(
  "/api/admin/client-galleries/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await db
        .collection("clientGalleries")
        .deleteOne({ id: Number(req.params.id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      res.json({ message: "Gallery deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// GET client gallery by URL (public)
app.get("/api/galleries/:uniqueUrl", async (req, res) => {
  try {
    const gallery = await db
      .collection("clientGalleries")
      .findOne({ uniqueUrl: req.params.uniqueUrl });

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Check if expired
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      return res.status(410).json({ error: "Gallery has expired" });
    }

    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH like/unlike photo in client gallery (optimized toggle system)
app.patch(
  "/api/galleries/:uniqueUrl/photos/:photoId/like",
  likeLimiter,
  async (req, res) => {
    try {
      const { uniqueUrl, photoId } = req.params;
      const photoIdNum = Number(photoId);

      // Verify gallery exists
      const gallery = await db
        .collection("clientGalleries")
        .findOne({ uniqueUrl });

      if (!gallery) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      // Verify photo exists in gallery
      const photoExists = gallery.photos?.some(
        (p) => p.id === photoIdNum || String(p.id) === String(photoId),
      );

      if (!photoExists) {
        return res
          .status(404)
          .json({ error: "Photo not found in this gallery" });
      }

      // Get client identifier
      const clientIp =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket.remoteAddress ||
        "unknown";

      // Check if already liked
      const existingLike = await db.collection("galleryLikes").findOne({
        uniqueUrl,
        photoId: photoIdNum,
        identifier: clientIp,
      });

      let isLiked;
      let increment;

      if (existingLike) {
        // Unlike: Remove the like
        await db.collection("galleryLikes").deleteOne({
          uniqueUrl,
          photoId: photoIdNum,
          identifier: clientIp,
        });
        isLiked = false;
        increment = -1;
      } else {
        // Like: Add the like
        await db.collection("galleryLikes").insertOne({
          uniqueUrl,
          photoId: photoIdNum,
          identifier: clientIp,
          likedAt: new Date(),
        });
        isLiked = true;
        increment = 1;
      }

      // Update like count in the gallery
      let result = await db
        .collection("clientGalleries")
        .findOneAndUpdate(
          { uniqueUrl, "photos.id": photoIdNum },
          { $inc: { "photos.$.likes": increment } },
          { returnDocument: "after" },
        );

      // Fallback to string match if needed
      if (!result.value) {
        result = await db
          .collection("clientGalleries")
          .findOneAndUpdate(
            { uniqueUrl, "photos.id": photoId },
            { $inc: { "photos.$.likes": increment } },
            { returnDocument: "after" },
          );
      }

      if (!result.value) {
        return res.status(500).json({ error: "Failed to update photo likes" });
      }

      // Find and return updated photo
      const updatedPhoto =
        result.value.photos?.find((p) => p.id === photoIdNum) ||
        result.value.photos?.find((p) => String(p.id) === String(photoId));

      if (!updatedPhoto) {
        return res
          .status(500)
          .json({ error: "Failed to retrieve updated photo" });
      }

      const updatedLikes = Math.max(0, updatedPhoto.likes || 0);

      res.json({
        likes: updatedLikes,
        isLiked,
        photoId: photoIdNum,
      });
    } catch (error) {
      console.error("Like error:", error.message);
      res.status(500).json({
        error: "Failed to process like",
        details: error.message,
      });
    }
  },
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API documentation available in README.md`);
  });
});
