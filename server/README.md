# Studio Storm Server

Node.js/Express API server for serving Studio Storm portfolio data from MongoDB.

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Yarn or npm

### 1. Start MongoDB with Docker Compose

```bash
docker-compose up -d
```

This will start:
- **MongoDB** on `mongodb://localhost:27017`
- **Mongo Express** (UI) on `http://localhost:8081`

### 2. Install Dependencies

```bash
cd server
yarn install
# or
npm install
```

### 3. Seed the Database

```bash
yarn seed
# or
npm run seed
```

This populates MongoDB with initial photo, album, and organization data.

### 4. Start the Server

```bash
yarn dev
# or
npm run dev
```

Server will run on `http://localhost:5000`

## API Routes

### Photos

- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get photo by ID
- `GET /api/photos/featured/list` - Get featured photos sorted by likes
- `GET /api/albums/:albumId/photos` - Get photos by album
- `PATCH /api/photos/:id/like` - Increment likes for a photo

### Albums

- `GET /api/albums` - Get all albums
- `GET /api/albums/main` - Get main albums only (without parent)
- `GET /api/albums/:id` - Get album by ID
- `GET /api/albums/slug/:slug` - Get album by slug
- `GET /api/albums/:parentId/subalbums` - Get subalbums by parent ID

### Organizations

- `GET /api/organizations` - Get all organizations

### Health Check

- `GET /api/health` - Server health check

## Database Collections

### photos

```javascript
{
  id: Number,
  title: String,
  description: String,
  imageUrl: String,
  dateTaken: String,
  location: String,
  camera: {
    model: String,
    iso: Number,
    aperture: String,
    shutterSpeed: String,
    focalLength: String
  },
  albumId: Number,
  width: Number,
  height: Number,
  isFeatured: Boolean,
  likes: Number
}
```

### albums

```javascript
{
  id: Number,
  name: String,
  slug: String,
  description: String,
  coverPhotoId: Number,
  photoCount: Number,
  parentId: Number (optional - for subalbums)
}
```

### organizations

```javascript
{
  id: Number,
  name: String,
  website: String,
  description: String
}
```

## Environment Variables

See `.env` file for configuration. Key variables:

- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret for JWT authentication (for future CMS)

## Future Features

- User authentication & JWT
- CMS admin panel
- Private gallery management
- Photo upload & management
- Analytics & stats

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs mongodb

# Access MongoDB CLI
docker exec -it studio-storm-mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Clear data and restart
docker-compose down -v
docker-compose up -d
```

## Mongo Express UI

Access at `http://localhost:8081` to browse and manage MongoDB data visually.

- Username: `admin`
- Password: `password123`

## Next Steps

1. Connect frontend to these API endpoints
2. Implement authentication
3. Build CMS admin panel
4. Add photo upload functionality
5. Implement private galleries
6. Add like system integration
