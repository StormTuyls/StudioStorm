# Studio Storm | Sports Photography

A modern, minimal sports photography portfolio site for Studio Storm, built with React, TypeScript, and Tailwind CSS.

## Features

- 📸 **Masonry Grid Gallery** - Pinterest-style photo layout with filtering and sorting
- 🖼️ **Photo Detail Pages** - Individual pages with metadata and camera settings
- ⚽ **Sports Albums** - Organized collections (Atletiek, Volleybal, Jiu-Jitsu) with subalbums per event
- 🤝 **Partners Showcase** - Display collaborations with sports organizations
- 👤 **About Page** - Studio Storm information and specializations
- 📧 **Contact Form** - Get in touch functionality in Dutch
- 🎨 **Clean Design** - Minimal, professional aesthetic
- ⚡ **Fast Performance** - Built with Vite for instant HMR
- 🔐 **Admin CMS** - Complete content management system
- 📤 **File Uploads** - Image upload with validation (max 10MB, images only)
- 👥 **Client Galleries** - Private galleries with shareable links
- ❤️ **Like System** - Spam-protected photo likes (IP-based tracking + rate limiting)

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe code
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS v4.1** - Utility-first CSS framework
- **React Router 7** - Client-side routing

### Backend
- **Node.js** - Runtime
- **Express 4.18** - API framework
- **MongoDB 7.0** - Database
- **Docker Compose** - Container orchestration

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Docker & Docker Compose

### Installation & Setup

#### 1. Start MongoDB with Docker

```bash
docker-compose up -d
```

This starts:
- MongoDB on `mongodb://localhost:27017`
- Mongo Express UI on `http://localhost:8081`

#### 2. Install Dependencies

```bash
# Frontend
yarn install

# Backend
cd server && yarn install && cd ..
```

#### 3. Seed Database

```bash
cd server
yarn seed
cd ..
```

#### 4. Start Development Servers

**Terminal 1 - Frontend:**
```bash
yarn dev
```
Available at `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd server
yarn dev
```
Running on `http://localhost:5000`

### Production Build

```bash
yarn build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PhotoCard.tsx
│   └── PhotoGrid.tsx
├── pages/           # Page components
│   ├── Gallery.tsx
│   ├── PhotoDetail.tsx
│   ├── Albums.tsx
│   ├── AlbumDetail.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── data/            # Data layer
│   └── database.ts  # Dummy photo database
├── types.ts         # TypeScript type definitions
├── App.tsx          # Main app component with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Customization

### Adding Photos

Edit `src/data/database.ts` to add your own photos. Each photo requires:

- `id`: Unique identifier
- `title`: Photo title
- `description`: Photo description
- `imageUrl`: Photo URL (replace Unsplash placeholders with your own)
- `dateTaken`: Date in YYYY-MM-DD format
- `location`: Where the photo was taken
- `camera`: Camera settings object (model, ISO, aperture, shutter speed, focal length)
- `albumId`: Which album the photo belongs to
- `width` & `height`: Dimensions

### Adding Albums

Albums are also defined in `src/data/database.ts`. Each album needs:

- `id`: Unique identifier
- `name`: Album name
- `slug`: URL-friendly slug
- `description`: Album description
- `coverPhotoId`: ID of the photo to use as cover
### Subalbums

To create subalbums (events within a sport):

1. Create a parent album (e.g., Atletiek with id: 1)
2. Add subalbums with `parentId: 1`:

```typescript
{
  id: 101,
  name: 'BK Veldlopen 2025',
  slug: 'atletiek/bk-veldlopen-2025',
  description: 'Belgisch Kampioenschap',
  coverPhotoId: 1,
  photoCount: 4,
  parentId: 1, // Links to Atletiek
}
```

### Styling

The site uses Tailwind CSS v4.1. You can customize:

- Colors, fonts, and spacing in `tailwind.config.js` (add if needed)
- Global styles in `src/index.css`
- Component-specific styles using Tailwind utility classes

## API Documentation

Full API documentation available in [server/README.md](server/README.md)

### Key Routes

```
GET  /api/photos              - All photos
GET  /api/photos/:id          - Single photo
GET  /api/photos/featured/list - Featured photos
PATCH /api/photos/:id/like    - Increment likes

GET  /api/albums              - All albums
GET  /api/albums/main         - Main albums only
GET  /api/albums/slug/:slug   - Album by slug
GET  /api/albums/:id/subalbums - Subalbums

GET  /api/organizations       - Organizations
```

## Roadmap

### Phase 1: Database Integration ✅
- [x] MongoDB setup with Docker
- [x] Express API server
- [x] Data seeding
- [ ] Connect frontend to API

### Phase 2: CMS Development
- [ ] Admin authentication (JWT)
- [ ] Album/photo management interface
- [ ] Photo upload with drag & drop
- [ ] Bulk operations

### Phase 3: Private Galleries
- [ ] Gallery creation with unique links
- [ ] Password protection
- [ ] Share with clients
- [ ] Expiration management

### Phase 4: Like System & Analytics
- [ ] Like tracking
- [ ] Favorites in private galleries
- [ ] Analytics dashboard

### Phase 5: Polish & Optimization
- [ ] SEO optimization
- [ ] Image optimization
- [ ] Performance monitoring
- [ ] Email notifications

## Admin CMS

Studio Storm includes a complete content management system for managing photos, albums, and client galleries.

### Accessing the Admin Panel

1. Navigate to `http://localhost:5174/admin/login`
2. **Default credentials:**
   - Username: `admin`
   - Password: `admin123`
   - ⚠️ **Change these in production!**

### CMS Features

#### 📸 Photos Management
- **Upload Photos**: Upload images directly (max 10MB, accepts jpg/png/gif/webp)
- **Feature Photos**: Toggle featured status to highlight photos on homepage
- **Edit Metadata**: Add title, description, location, and album assignment
- **Delete Photos**: Remove unwanted photos
- **View Stats**: See like counts for each photo

#### 📁 Albums Management
- **Create Albums**: Add new sport categories or event albums
- **Subalbums**: Organize events under main sport categories
  - Example: `Atletiek` → `BK Veldlopen 2025`
- **Slug Handling**: Supports nested slugs (e.g., `atletiek/bk-veldlopen-2025`)
- **Cover Photos**: Assign cover images to albums
- **Delete Albums**: Remove albums and their hierarchy

#### 👥 Client Galleries
- **Private Galleries**: Create secure galleries for clients
- **Shareable Links**: Generate unique URLs like `/gallery/abc-123-xyz`
- **Photo Uploads**: Add photos directly to client galleries
- **Client Info**: Track client name and description
- **Copy Link**: One-click copy functionality for sharing

### Like System with Spam Prevention

The portfolio includes a sophisticated like system:

- **IP Tracking**: Each IP can only like a photo once
- **Rate Limiting**: 10 likes per 15 minutes per IP
- **User Feedback**: Clear messages for duplicate likes or rate limits
- **Database Tracking**: Likes stored in MongoDB with unique constraints

### API Endpoints

#### Public Endpoints
```bash
GET  /api/photos               # List all photos
GET  /api/photos/:id           # Get single photo
GET  /api/photos/featured/list # Get featured photos
PATCH /api/photos/:id/like     # Like a photo (spam-protected)
GET  /api/albums               # List all albums
GET  /api/albums/main          # Get main albums only
GET  /api/albums/slug/*        # Get album by slug (supports nested)
GET  /api/galleries/:url       # View client gallery
```

#### Admin Endpoints (Require Authentication)
```bash
POST   /api/auth/login                      # Login
GET    /api/auth/me                         # Get current user

POST   /api/admin/photos                    # Create photo (with file upload)
PATCH  /api/admin/photos/:id                # Update photo
DELETE /api/admin/photos/:id                # Delete photo

POST   /api/admin/albums                    # Create album
PATCH  /api/admin/albums/:id                # Update album
DELETE /api/admin/albums/:id                # Delete album

POST   /api/admin/client-galleries          # Create client gallery
GET    /api/admin/client-galleries          # List all galleries
POST   /api/admin/client-galleries/:id/photos # Upload to gallery
DELETE /api/admin/client-galleries/:id      # Delete gallery
```

### File Upload Configuration

- **Location**: `server/uploads/`
- **Max Size**: 10MB per file
- **Allowed Types**: jpeg, jpg, png, gif, webp
- **Naming**: UUID-based to prevent conflicts
- **Access**: Files served via `/uploads/:filename`

### Security Features

- **JWT Authentication**: 24-hour token expiration
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse of like system
- **File Validation**: Checks file types and sizes
- **CORS Configuration**: Restricts API access

### Customization

#### Change Admin Password

1. Update `server/seed.js`:
```javascript
const usersData = [
  {
    id: 1,
    username: 'yourusername',
    passwordHash: bcrypt.hashSync('yournewpassword', 10),
    role: 'admin',
    createdAt: new Date(),
  },
];
```

2. Re-run seed script:
```bash
cd server && node seed.js
```

#### Change JWT Secret

Update `server/.env`:
```
JWT_SECRET=your-super-secret-key-here-use-random-string
```

## Docker Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f mongodb

# Clear all volumes and restart
docker-compose down -v
docker-compose up -d
```

## Mongo Express

Web UI for MongoDB at http://localhost:8081
- **Username:** admin
- **Password:** password123

## Production Deployment

Before deploying to production:

1. ✅ Change admin password in seed script
2. ✅ Update JWT_SECRET in environment variables
3. ✅ Set proper CORS origins
4. ✅ Configure file upload storage (consider S3/CDN)
5. ✅ Set up proper MongoDB authentication
6. ✅ Use environment variables for all secrets
7. ✅ Enable HTTPS
8. ✅ Set up backup strategy for MongoDB

## License

MIT
