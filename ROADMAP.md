# Studio Storm - Development Roadmap

## Phase 1: Backend & Database (Q1 2026)

### Database Setup
- [ ] Choose database (PostgreSQL recommended for relational data + JSON support)
- [ ] Design database schema (albums, photos, users, organizations, likes)
- [ ] Set up local development database
- [ ] Create migration system (Prisma/TypeORM)
- [ ] Migrate current JSON data to database

### API Development
- [ ] Set up Express/Fastify/Next.js API routes
- [ ] Authentication middleware (JWT)
- [ ] CRUD endpoints for albums
- [ ] CRUD endpoints for photos
- [ ] File upload endpoint (with image processing)
- [ ] Organization endpoints
- [ ] Error handling and validation

### Image Storage
- [ ] Local storage option for development
- [ ] Cloud storage integration (Cloudinary/S3)
- [ ] Image optimization pipeline (Sharp/ImageMagick)
- [ ] Automatic thumbnail generation
- [ ] WebP conversion for better performance

## Phase 2: CMS Development (Q2 2026)

### Admin Panel UI
- [ ] Admin login page
- [ ] Protected admin routes
- [ ] Dashboard with statistics
- [ ] Album manager (create, edit, delete, reorder)
- [ ] Photo uploader (drag & drop, bulk upload)
- [ ] Photo editor (metadata, crop, rotate)
- [ ] Organization manager

### Album Management
- [ ] Create/edit/delete main albums
- [ ] Create/edit/delete subalbums (events)
- [ ] Set cover photos
- [ ] Reorder photos within albums
- [ ] Move photos between albums
- [ ] Bulk operations

### Photo Management
- [ ] Upload photos with metadata
- [ ] Edit photo information
- [ ] Tag photos
- [ ] Delete multiple photos
- [ ] Search and filter photos
- [ ] Preview before publishing

## Phase 3: Private Galleries (Q2-Q3 2026)

### Gallery Creation
- [ ] Create private gallery interface
- [ ] Select photos from existing albums
- [ ] Generate unique shareable links
- [ ] Set password protection (optional)
- [ ] Set expiration dates
- [ ] Custom gallery name/description

### Client Access
- [ ] Access gallery via unique link
- [ ] Password entry (if protected)
- [ ] View photos in grid/slideshow
- [ ] Download options (individual/zip)
- [ ] Mobile-friendly viewing
- [ ] Print to PDF option

### Gallery Management
- [ ] List all private galleries
- [ ] Edit gallery settings
- [ ] View access statistics
- [ ] Resend gallery links
- [ ] Archive/delete galleries
- [ ] Copy gallery link

### Notifications
- [ ] Email gallery link to client
- [ ] Email template customization
- [ ] Reminder emails before expiration
- [ ] Download notification to admin

## Phase 4: Like & Favorite System (Q3 2026)

### Public Gallery Likes
- [ ] Like button on photo cards
- [ ] Like counter display
- [ ] Anonymous likes (no login required)
- [ ] Prevent duplicate likes (cookie/IP based)
- [ ] "Most Liked" section on homepage
- [ ] Trending photos algorithm

### Private Gallery Favorites
- [ ] Client can select favorites
- [ ] Download only favorites
- [ ] Share favorite list with photographer
- [ ] Comment on favorite photos (optional)
- [ ] Export favorites as PDF/email

### Analytics
- [ ] Like statistics per photo
- [ ] Like trends over time
- [ ] Popular albums
- [ ] Favorite photos by clients
- [ ] Export analytics data

## Phase 5: Polish & Optimization (Q4 2026)

### Performance
- [ ] Image lazy loading
- [ ] Progressive image loading (blur-up)
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] CDN integration
- [ ] Caching strategy

### SEO
- [ ] Meta tags for all pages
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] Structured data (JSON-LD)
- [ ] Alt text for all images
- [ ] Performance optimization (Core Web Vitals)

### Additional Features
- [ ] Newsletter signup
- [ ] Blog/News section
- [ ] Client testimonials
- [ ] Booking/inquiry form
- [ ] FAQ section
- [ ] Multi-language support (NL/FR/EN)

### Security
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Secure file uploads
- [ ] HTTPS enforcement

## Tech Stack Recommendations

### Backend
- **Framework**: Next.js 14+ (App Router) or Express
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js or Auth0
- **Storage**: Cloudinary or AWS S3
- **Email**: SendGrid or Resend

### Deployment
- **Hosting**: Vercel (Frontend + API) or Railway/Render
- **Database**: Supabase or Railway PostgreSQL
- **Storage**: Cloudinary (free tier: 25GB)
- **Domain**: studiostorm.be

### Development Tools
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Testing**: Vitest + Playwright
- **Monitoring**: Sentry (errors) + Plausible (analytics)

## Cost Estimation (Monthly)

### Minimal Setup
- Vercel Free: €0
- Supabase Free: €0 (up to 500MB)
- Cloudinary Free: €0 (25GB storage, 25GB bandwidth)
- **Total: €0/month** (good for starting out)

### Growth Setup
- Vercel Pro: €20
- Supabase Pro: €25 (8GB database)
- Cloudinary Plus: €89 (200GB storage)
- **Total: ~€134/month**

### Professional Setup
- Vercel Team: €40
- Railway Pro: €20 (PostgreSQL)
- AWS S3: ~€23 (1TB storage)
- SendGrid: €15 (email)
- **Total: ~€98/month**

## Timeline

- **Phase 1** (Backend): 4-6 weeks
- **Phase 2** (CMS): 6-8 weeks
- **Phase 3** (Private Galleries): 4-6 weeks
- **Phase 4** (Likes): 2-3 weeks
- **Phase 5** (Polish): 3-4 weeks

**Total Estimated Time**: 5-6 months part-time

## Next Immediate Steps

1. **Week 1**: Set up PostgreSQL + Prisma schema
2. **Week 2**: Create API endpoints for albums/photos
3. **Week 3**: Implement image upload with Cloudinary
4. **Week 4**: Build basic admin panel
5. **Week 5**: Integrate frontend with API

---

**Note**: This is a living document. Priorities may shift based on client needs and business requirements.
