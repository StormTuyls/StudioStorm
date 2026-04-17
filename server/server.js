import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import {
  authenticateToken,
  requireAdmin,
  generateToken,
} from "./middleware/auth.js";
import { upload } from "./middleware/upload.js";
import { extractExifData } from "./utils/exif.js";
import { optimizePhotoUpload } from "./utils/optimizeImage.js";

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

// EVENTS (aliases for albums)

// GET all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await db.collection("albums").find({}).toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET main events only (years)
app.get("/api/events/main", async (req, res) => {
  try {
    const events = await db
      .collection("albums")
      .find({ parentId: { $exists: false } })
      .toArray();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET event by slug
app.get("/api/events/slug/*", async (req, res) => {
  try {
    const slug = req.params[0];
    const event = await db.collection("albums").findOne({ slug: slug });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await db
      .collection("albums")
      .findOne({ id: Number(req.params.id) });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET subevents by parent ID
app.get("/api/events/:parentId/subevents", async (req, res) => {
  try {
    const subevents = await db
      .collection("albums")
      .find({ parentId: Number(req.params.parentId) })
      .toArray();
    res.json(subevents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET photos by event
app.get("/api/events/:eventId/photos", async (req, res) => {
  try {
    const photos = await db
      .collection("photos")
      .find({ albumId: Number(req.params.eventId) })
      .toArray();
    res.json(photos);
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

// ==================== AUTH ROUTES ====================

// POST register new client
// Admin-only user creation with role support
app.post(
  "/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { username, email, password, firstName, lastName, role } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Username, email, and password are required" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters" });
      }

      // Validate role
      if (role && !["client", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Check if user already exists
      const existingUser = await db
        .collection("users")
        .findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      // Get next user ID
      const lastUser = await db
        .collection("users")
        .findOne({}, { sort: { id: -1 } });
      const nextId = lastUser ? lastUser.id + 1 : 1;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        id: nextId,
        username,
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        passwordHash,
        role: role || "client",
        createdAt: new Date(),
        lastLogin: null,
      };

      await db.collection("users").insertOne(newUser);

      const { passwordHash: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // Check if user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Get next user ID
    const lastUser = await db
      .collection("users")
      .findOne({}, { sort: { id: -1 } });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: nextId,
      username,
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      passwordHash,
      role: "client",
      createdAt: new Date(),
      lastLogin: null,
    };

    await db.collection("users").insertOne(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    // Update last login
    await db
      .collection("users")
      .updateOne({ id: user.id }, { $set: { lastLogin: new Date() } });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user's assigned galleries (client)
app.get("/api/my-galleries", authenticateToken, async (req, res) => {
  try {
    const galleries = await db
      .collection("clientGalleries")
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER MANAGEMENT ====================

// GET all users (admin only)
app.get(
  "/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await db
        .collection("users")
        .find({}, { projection: { passwordHash: 0 } })
        .toArray();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// GET user by ID
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const user = await db
      .collection("users")
      .findOne(
        { id: Number(req.params.id) },
        { projection: { passwordHash: 0 } },
      );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update user
app.patch("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { firstName, lastName, email, role } = req.body;

    // Users can only update their own profile, unless they're admin
    const requestingUser = await db
      .collection("users")
      .findOne({ id: req.user.id });

    if (requestingUser.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Only admins can change roles
    if (role !== undefined && requestingUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only admins can change user roles" });
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { id: userId },
        { $set: updateData },
        { returnDocument: "after" },
      );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = result;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE user (admin only)
app.delete(
  "/api/admin/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      // Prevent deleting yourself
      if (req.user.id === userId) {
        return res
          .status(400)
          .json({ error: "Cannot delete your own account" });
      }

      const result = await db.collection("users").deleteOne({ id: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

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

      const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;

      // Extract EXIF data if image file was uploaded (must run before optimize rewrites the file)
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

      let imageWidth = 800;
      let imageHeight = 600;
      let storedFilename = req.file?.filename;

      if (req.file) {
        const filePath = req.file.path;
        console.log(`🔍 Extracting EXIF from: ${filePath}`);
        const exifData = extractExifData(filePath);
        console.log(`📋 EXIF Data:`, exifData);

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

        const optimized = await optimizePhotoUpload(filePath);
        storedFilename = optimized.filename;
        imageWidth = optimized.width || imageWidth;
        imageHeight = optimized.height || imageHeight;
        console.log(
          `🖼️ Optimized upload → ${storedFilename} (${optimized.size} bytes, ${imageWidth}×${imageHeight})`,
        );
      }

      const imageUrl = req.file
        ? `${baseUrl}/uploads/${storedFilename}`
        : req.body.imageUrl;

      console.log(`📸 Image URL: ${imageUrl}`);

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
        width: imageWidth,
        height: imageHeight,
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

// EVENTS CRUD (aliases for albums)

// POST create event
app.post("/api/admin/events", authenticateToken, async (req, res) => {
  try {
    const { name, slug, description, sport, coverPhotoId, parentId } = req.body;

    const lastEvent = await db
      .collection("albums")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const nextId = lastEvent.length > 0 ? lastEvent[0].id + 1 : 1;

    const newEvent = {
      id: nextId,
      name,
      slug,
      description,
      sport: sport || "other",
      coverPhotoId: coverPhotoId ? Number(coverPhotoId) : null,
      photoCount: 0,
      visibility: "public",
      revenue: 0,
      status: "draft",
      ...(parentId && { parentId: Number(parentId) }),
    };

    await db.collection("albums").insertOne(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update event
app.patch("/api/admin/events/:id", authenticateToken, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const updates = req.body;

    delete updates._id;

    if (updates.coverPhotoId) {
      updates.coverPhotoId = Number(updates.coverPhotoId);
    }
    if (updates.parentId) {
      updates.parentId = Number(updates.parentId);
    }

    await db.collection("albums").updateOne({ id: eventId }, { $set: updates });

    const updatedEvent = await db.collection("albums").findOne({ id: eventId });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE event
app.delete("/api/admin/events/:id", authenticateToken, async (req, res) => {
  try {
    const result = await db
      .collection("albums")
      .deleteOne({ id: Number(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CLIENT GALLERIES ====================

// POST create client gallery
app.post(
  "/api/admin/client-galleries",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        clientName,
        description,
        userId,
        password,
        expiresAt,
        allowDownload,
      } = req.body;
      const uniqueUrl = uuidv4();

      const newGallery = {
        id: Date.now(),
        clientName,
        description,
        uniqueUrl,
        userId: userId || null,
        isProtected: !!password,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        allowDownload: allowDownload !== false,
        photos: [],
        createdAt: new Date(),
      };

      await db.collection("clientGalleries").insertOne(newGallery);
      res.status(201).json(newGallery);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// GET all client galleries (admin)
app.get(
  "/api/admin/client-galleries",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
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
  },
);

// POST upload photo to client gallery
app.post(
  "/api/admin/client-galleries/:id/photos",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const galleryId = Number(req.params.id);
      const { title, description } = req.body;

      const baseUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;

      if (!req.file) {
        return res.status(400).json({ error: "Image file required" });
      }

      const optimized = await optimizePhotoUpload(req.file.path);
      const imageUrl = `${baseUrl}/uploads/${optimized.filename}`;

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

// PATCH update client gallery
app.patch(
  "/api/admin/client-galleries/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const galleryId = Number(req.params.id);
      const {
        clientName,
        description,
        userId,
        password,
        expiresAt,
        allowDownload,
      } = req.body;

      const updateData = {};
      if (clientName !== undefined) updateData.clientName = clientName;
      if (description !== undefined) updateData.description = description;
      if (userId !== undefined) updateData.userId = userId;
      if (password !== undefined) {
        updateData.password = password;
        updateData.isProtected = !!password;
      }
      if (expiresAt !== undefined)
        updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      if (allowDownload !== undefined) updateData.allowDownload = allowDownload;

      const result = await db
        .collection("clientGalleries")
        .findOneAndUpdate(
          { id: galleryId },
          { $set: updateData },
          { returnDocument: "after" },
        );

      if (!result.value) {
        return res.status(404).json({ error: "Gallery not found" });
      }

      res.json(result.value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// DELETE client gallery
app.delete(
  "/api/admin/client-galleries/:id",
  authenticateToken,
  requireAdmin,
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

// POST verify gallery password
app.post("/api/galleries/:uniqueUrl/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    const gallery = await db
      .collection("clientGalleries")
      .findOne({ uniqueUrl: req.params.uniqueUrl });

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    if (!gallery.isProtected) {
      return res.json({ valid: true });
    }

    const isValid = password === gallery.password;
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET client gallery by URL (public)
app.get("/api/galleries/:uniqueUrl", async (req, res) => {
  try {
    const { password } = req.query;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

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

    // Check access control
    let hasAccess = false;

    // If user is logged in and gallery is assigned to them
    if (token && gallery.userId) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key-change-in-production",
        );
        if (decoded.id === gallery.userId) {
          hasAccess = true;
        }
      } catch (err) {
        // Token invalid, continue to password check
      }
    }

    // If password protected and no user access
    if (gallery.isProtected && !hasAccess) {
      if (!password || password !== gallery.password) {
        return res.status(401).json({
          error: "Password required",
          isProtected: true,
          requiresAuth: true,
        });
      }
    }

    // Don't send password in response
    const { password: _, ...galleryData } = gallery;
    res.json(galleryData);
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

// ============== ORGANIZATIONS ADMIN ENDPOINTS ==============

// Create organization
app.post("/api/admin/organizations", authenticateToken, async (req, res) => {
  try {
    const { name, logo, website } = req.body;

    // Get max ID
    const maxOrg = await db
      .collection("organizations")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newId = maxOrg.length > 0 ? maxOrg[0].id + 1 : 1;

    const organization = {
      id: newId,
      name,
      logo,
      website,
    };

    await db.collection("organizations").insertOne(organization);
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update organization
app.patch(
  "/api/admin/organizations/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { name, logo, website } = req.body;
      const result = await db
        .collection("organizations")
        .findOneAndUpdate(
          { id: Number(req.params.id) },
          { $set: { name, logo, website } },
          { returnDocument: "after" },
        );

      if (!result.value) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(result.value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete organization
app.delete(
  "/api/admin/organizations/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await db
        .collection("organizations")
        .deleteOne({ id: Number(req.params.id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json({ message: "Organization deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// ============== SITE SETTINGS ENDPOINTS ==============

// Get site settings
app.get("/api/site-settings", async (req, res) => {
  try {
    const settings = await db.collection("siteSettings").findOne({ id: 1 });
    if (!settings) {
      // Return defaults if none exist
      return res.json({
        id: 1,
        siteName: "STUDIO STORM",
        heroTitle: "STUDIO STORM",
        heroSubtitle:
          "Atletiekfotografie - vastleggen van snelheid, kracht en emotie",
        heroImage:
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600",
        footerText: "Studio Storm. All rights reserved.",
        instagramHandle: "@studiostorm.sports",
        instagramUrl: "https://instagram.com/studiostorm.sports",
        contactEmail: "",
        featuredSectionTitle: "Onze Beste Werk",
        featuredSectionSubtitle:
          "De meest geliefde momenten van sport en actiefotografie",
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update site settings (admin only)
app.patch("/api/admin/site-settings", authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    const result = await db
      .collection("siteSettings")
      .findOneAndUpdate(
        { id: 1 },
        { $set: settings },
        { upsert: true, returnDocument: "after" },
      );

    res.json(result.value || settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== ABOUT CONTENT ENDPOINTS ==============

// Get about content
app.get("/api/about-content", async (req, res) => {
  try {
    const content = await db.collection("aboutContent").findOne({ id: 1 });
    if (!content) {
      // Return defaults
      return res.json({
        id: 1,
        title: "Over Studio Storm",
        image:
          "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400",
        paragraphs: [
          "Studio Storm is gespecialiseerd in sportfotografie met een focus op atletiek. We leggen de meest intense en emotionele momenten van sport vast - van de sprintfinish op de piste tot de krachtige smash op de volleybalcourt.",
          "Met jarenlange ervaring in het fotograferen van diverse atletiekwedstrijden, van lokale veldlopen tot Diamond League meetings, begrijpen we het belang van het juiste moment. We werken met professionele apparatuur en zijn getraind om snel te reageren op de dynamiek van sport.",
          "Of het nu gaat om een lokale wedstrijd of een groot sportevenement, Studio Storm zorgt ervoor dat jouw belangrijkste momenten worden vastgelegd met de hoogste kwaliteit en oog voor detail. We hebben samengewerkt met organisaties zoals Atletieknieuws, Agones Media, en Runnerslab Athletics Team.",
        ],
        specializations: [
          {
            name: "Atletiek",
            subtitle: "Hoofdfocus - alle disciplines",
            description:
              "Van veldlopen tot pistewedstrijden, van straatlopen tot Diamond League meetings. We leggen de intensiteit, emotie en schoonheid van atletiek vast.",
          },
          {
            name: "Volleybal",
            subtitle: "Indoor sportfotografie",
            description:
              "Dynamische actie op de court, van lokale competities tot landelijke bekers. Specialisatie in het vastleggen van snelle bewegingen en teamdynamiek.",
          },
          {
            name: "Jiu-Jitsu",
            subtitle: "Vechtsportfotografie",
            description:
              "Krachtige momenten uit de vechtsport, technische precisie en intense gevechten vastgelegd op het moment supreme.",
          },
        ],
        contactText:
          "Interesse in sportfotografie voor jouw team, club of evenement? Neem contact met ons op via",
        contactLinkText: "@studiostorm.sports",
        contactLinkUrl: "https://instagram.com/studiostorm.sports",
        contactSuffix: "op Instagram of via ons contactformulier.",
      });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update about content (admin only)
app.patch("/api/admin/about-content", authenticateToken, async (req, res) => {
  try {
    const content = req.body;
    const result = await db
      .collection("aboutContent")
      .findOneAndUpdate(
        { id: 1 },
        { $set: content },
        { upsert: true, returnDocument: "after" },
      );

    res.json(result.value || content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== CLIENTS ENDPOINTS ==============

// Get all clients
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await db.collection("clients").find({}).toArray();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create client (admin)
app.post("/api/admin/clients", authenticateToken, async (req, res) => {
  try {
    const { name, logo, website, featured } = req.body;
    const client = {
      id: new ObjectId().toString(),
      name,
      logo,
      website,
      featured: featured || false,
      createdAt: new Date(),
    };
    await db.collection("clients").insertOne(client);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client (admin)
app.patch("/api/admin/clients/:id", authenticateToken, async (req, res) => {
  try {
    const { name, logo, website, featured } = req.body;
    const result = await db.collection("clients").findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          name,
          logo,
          website,
          featured,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete client (admin)
app.delete("/api/admin/clients/:id", authenticateToken, async (req, res) => {
  try {
    const result = await db
      .collection("clients")
      .deleteOne({ id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== CONTACT SUBMISSIONS ENDPOINTS ==============

// Submit contact form (public)
app.post("/api/contact/submit", async (req, res) => {
  try {
    const { name, email, organization, service, eventDate, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const submission = {
      id: new ObjectId().toString(),
      name,
      email,
      organization,
      service,
      eventDate,
      message,
      status: "new",
      submittedAt: new Date(),
    };

    await db.collection("contactSubmissions").insertOne(submission);
    res.json({ message: "Contact form submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contact submissions (admin)
app.get(
  "/api/admin/contact-submissions",
  authenticateToken,
  async (req, res) => {
    try {
      const submissions = await db
        .collection("contactSubmissions")
        .find({})
        .sort({ submittedAt: -1 })
        .toArray();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Update contact submission status (admin)
app.patch(
  "/api/admin/contact-submissions/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { status } = req.body;
      const result = await db
        .collection("contactSubmissions")
        .findOneAndUpdate(
          { id: req.params.id },
          { $set: { status, updatedAt: new Date() } },
          { returnDocument: "after" },
        );

      if (!result.value) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(result.value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// Delete contact submission (admin)
app.delete(
  "/api/admin/contact-submissions/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const result = await db
        .collection("contactSubmissions")
        .deleteOne({ id: req.params.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json({ message: "Submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// ============== SITE SETTINGS ENDPOINTS (UPDATED) ==============

// Get site settings - now with admin endpoint for updates
app.patch("/api/admin/site-settings", authenticateToken, async (req, res) => {
  try {
    const {
      siteName,
      heroTitle,
      heroSubtitle,
      heroImage,
      footerText,
      instagramHandle,
      instagramUrl,
      contactEmail,
      featuredSectionTitle,
      featuredSectionSubtitle,
    } = req.body;

    const result = await db.collection("siteSettings").findOneAndUpdate(
      { id: 1 },
      {
        $set: {
          id: 1,
          siteName,
          heroTitle,
          heroSubtitle,
          heroImage,
          footerText,
          instagramHandle,
          instagramUrl,
          contactEmail,
          featuredSectionTitle,
          featuredSectionSubtitle,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", upsert: true },
    );

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVICES ====================
app.get("/api/services", async (req, res) => {
  try {
    const services = await db.collection("services").find({}).toArray();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/services", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      sport,
      whatsIncluded,
      startingPrice,
      deliverables,
      ctaLabel,
      ctaUrl,
      isActive,
    } = req.body;
    const service = {
      id: uuidv4(),
      name,
      description,
      sport: sport || "athletics",
      whatsIncluded: whatsIncluded || [],
      startingPrice: startingPrice || 0,
      deliverables: deliverables || [],
      ctaLabel: ctaLabel || "Learn More",
      ctaUrl: ctaUrl || "/contact",
      isActive: isActive !== false,
      displayOrder: (await db.collection("services").countDocuments()) + 1,
      createdAt: new Date(),
    };
    await db.collection("services").insertOne(service);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/services/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .collection("services")
      .findOneAndUpdate(
        { id },
        { $set: { ...req.body, updatedAt: new Date() } },
        { returnDocument: "after" },
      );
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/services/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("services").deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SPORTS ====================
app.get("/api/sports", async (req, res) => {
  try {
    const sportsCollection = db.collection("sports");
    let sports = await sportsCollection
      .find({})
      .sort({ order: 1, title: 1 })
      .toArray();

    if (sports.length === 0) {
      const defaults = [
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
      await sportsCollection.insertMany(defaults);
      sports = defaults;
    }

    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/sports", authenticateToken, async (req, res) => {
  try {
    const { title, slug, summary, imageUrl } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: "Title and slug are required" });
    }

    const existing = await db.collection("sports").findOne({ slug });
    if (existing) {
      return res.status(409).json({ error: "Sport slug already exists" });
    }

    const order = (await db.collection("sports").countDocuments()) + 1;
    const newSport = {
      id: Date.now(),
      title,
      slug,
      summary: summary || "",
      imageUrl: imageUrl || "",
      order,
      createdAt: new Date(),
    };

    await db.collection("sports").insertOne(newSport);
    res.status(201).json(newSport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/sports/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    delete updates._id;

    await db.collection("sports").updateOne({ id }, { $set: updates });
    const updatedSport = await db.collection("sports").findOne({ id });
    res.json(updatedSport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/sports/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db.collection("sports").deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Sport not found" });
    }

    res.json({ message: "Sport deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== JOURNAL ====================
app.get("/api/journal", async (req, res) => {
  try {
    const posts = await db
      .collection("journal")
      .find({})
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/journal", authenticateToken, async (req, res) => {
  try {
    const { title, date, summary, body, imageUrl } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const newPost = {
      id: Date.now(),
      title,
      date,
      summary: summary || "",
      body: body || "",
      imageUrl: imageUrl || "",
      createdAt: new Date(),
    };

    await db.collection("journal").insertOne(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/journal/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    delete updates._id;

    await db.collection("journal").updateOne({ id }, { $set: updates });
    const updatedPost = await db.collection("journal").findOne({ id });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/journal/:id", authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db.collection("journal").deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HOME SETTINGS ====================
app.get("/api/home-settings", async (req, res) => {
  try {
    const settings = await db
      .collection("homeSettings")
      .findOne({ id: "home-settings" });

    if (!settings) {
      return res.status(404).json({ error: "Home settings not found" });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/home-settings", authenticateToken, async (req, res) => {
  try {
    const { heroImageUrl, heroImageTitle, highlights } = req.body;

    const result = await db.collection("homeSettings").findOneAndUpdate(
      { id: "home-settings" },
      {
        $set: {
          heroImageUrl: heroImageUrl || "",
          heroImageTitle: heroImageTitle || "",
          highlights: highlights || [],
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return res.status(404).json({ error: "Home settings not found" });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PORTFOLIO ====================
app.get("/api/portfolio", async (req, res) => {
  try {
    const portfolio = await db
      .collection("portfolio")
      .find({})
      .sort({ sport: 1, order: 1 })
      .toArray();
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/portfolio", authenticateToken, async (req, res) => {
  try {
    const { photoId, sport, caption } = req.body;
    const item = {
      id: uuidv4(),
      photoId,
      sport: sport || "athletics",
      caption: caption || "",
      order: (await db.collection("portfolio").countDocuments()) + 1,
      createdAt: new Date(),
    };
    await db.collection("portfolio").insertOne(item);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/portfolio/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates._id;

    const result = await db
      .collection("portfolio")
      .findOneAndUpdate(
        { id },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    if (!result.value) {
      return res.status(404).json({ error: "Portfolio item not found" });
    }

    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/portfolio/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("portfolio").deleteOne({ id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTENT PAGES ====================
app.get("/api/content/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    let page = await db.collection("contentPages").findOne({ slug });
    if (!page) {
      // Return default empty structure
      page = {
        id: uuidv4(),
        slug,
        title: slug.replace("-", " ").toUpperCase(),
        blocks: [],
        seoTitle: "",
        seoDescription: "",
      };
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/content/:slug", authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db
      .collection("contentPages")
      .findOneAndUpdate(
        { slug },
        { $set: { ...req.body, updatedAt: new Date() } },
        { returnDocument: "after", upsert: true },
      );
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
