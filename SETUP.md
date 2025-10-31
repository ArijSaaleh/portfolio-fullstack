# Complete Setup Guide

This guide will walk you through setting up and running your full-stack portfolio application.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Git

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL Local Installation

1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE portfolio_db;
```

3. Update the `backend/.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
JWT_SECRET="your-secret-key-change-this"
PORT=3000
```

#### Option B: Use PostgreSQL Cloud Service

You can use services like:
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app) (Free tier available)

Get your connection string and add it to `backend/.env`:
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key-change-this"
PORT=3000
```

### 3. Initialize Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run seed
```

### 4. Start the Application

#### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3000`

#### Terminal 2: Start Frontend Dev Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## Admin Access

### Creating an Admin Account

The application requires an admin account to manage content. Create one using the backend seed script or manually:

#### Option 1: Using Prisma Studio
```bash
cd backend
npx prisma studio
```
This opens a web interface where you can create a User record. For the password, use a bcrypt hash.

#### Option 2: Using the Seed Script
Edit `backend/src/seed.ts` to set your admin credentials, then:
```bash
cd backend
npm run seed
```

#### Option 3: Manual Database Insert
```sql
-- Note: Replace 'your-hashed-password' with an actual bcrypt hash
INSERT INTO "User" (email, password) 
VALUES ('admin@example.com', 'your-hashed-password');
```

To generate a bcrypt hash for your password, you can use an online bcrypt generator or run this Node.js code:
```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('yourpassword', 10));
```

### Admin Login

1. Navigate to `http://localhost:5173/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

## Admin Features

From the admin dashboard, you can:

### 1. **Manage Projects**
   - Add new projects with:
     - Title, description, challenge, contribution
     - Technologies used
     - Hero image and gallery images
     - GitHub repository URL
     - Live demo URL
     - Video demo URL
     - Performance metrics (accuracy, speed)
   - Edit existing projects
   - Delete projects
   - Toggle published status

### 2. **Manage Blog Posts**
   - Create blog posts with:
     - Title (auto-generates URL slug)
     - Excerpt and full content
     - Type (article, tutorial, video)
     - Featured image
     - Read time estimate
     - Video URL (for video posts)
     - Published date
   - Edit and delete posts
   - Toggle published status

### 3. **Manage Work Experience**
   - Add experience entries with:
     - Company name and logo
     - Position and location
     - Start and end dates
     - Current position toggle
     - Description
     - Skills/technologies used
   - Edit and delete entries

### 4. **Manage Achievements**
   - Add achievements with:
     - Title and description
     - Category (award, certification, participation, social)
     - Date
     - Multiple images
     - Video URL
     - External links (certificates, event pages)
   - Edit and delete achievements
   - Toggle published status

### 5. **View Contact Messages**
   - See all contact form submissions
   - View sender details and message content
   - Delete messages

## Project Structure

```
portfolio-fullstack/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts            # Authentication routes
│   │   │   ├── projects.ts        # Project CRUD
│   │   │   ├── blogs.ts           # Blog CRUD
│   │   │   ├── experiences.ts     # Experience CRUD
│   │   │   ├── achievements.ts    # Achievement CRUD
│   │   │   └── contact.ts         # Contact messages
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT authentication
│   │   ├── server.ts              # Express server
│   │   └── seed.ts                # Database seeding
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                # shadcn/ui components
    │   │   ├── Hero.tsx           # Homepage hero
    │   │   ├── About.tsx          # About section
    │   │   ├── Projects.tsx       # Projects grid
    │   │   ├── Experience.tsx     # Experience timeline
    │   │   ├── Achievements.tsx   # Achievements grid
    │   │   ├── Blog.tsx           # Blog posts grid
    │   │   ├── Contact.tsx        # Contact form
    │   │   └── Footer.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx       # Main portfolio page
    │   │   ├── ProjectDetailPage.tsx
    │   │   ├── BlogDetailPage.tsx
    │   │   ├── AdminLogin.tsx
    │   │   ├── AdminDashboard.tsx
    │   │   ├── AdminProjects.tsx
    │   │   ├── AdminBlogs.tsx
    │   │   ├── AdminExperiences.tsx
    │   │   ├── AdminAchievements.tsx
    │   │   └── AdminMessages.tsx
    │   └── App.tsx                # Route configuration
    └── package.json
```

## Available Routes

### Public Routes
- `/` - Homepage with all portfolio sections
- `/project/:id` - Project detail page
- `/blog/:slug` - Blog post detail page
- `/admin/login` - Admin login page

### Admin Routes (Protected)
- `/admin/dashboard` - Overview and navigation
- `/admin/projects` - Project management
- `/admin/blogs` - Blog management
- `/admin/experiences` - Experience management
- `/admin/achievements` - Achievement management
- `/admin/messages` - View contact messages

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Projects
- `GET /api/projects` - List all published projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Blogs
- `GET /api/blogs` - List all published blogs
- `GET /api/blogs/:id` - Get blog details
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)

### Experiences
- `GET /api/experiences` - List all experiences
- `GET /api/experiences/:id` - Get experience details
- `POST /api/experiences` - Create experience (auth required)
- `PUT /api/experiences/:id` - Update experience (auth required)
- `DELETE /api/experiences/:id` - Delete experience (auth required)

### Achievements
- `GET /api/achievements` - List all published achievements
- `GET /api/achievements/:id` - Get achievement details
- `POST /api/achievements` - Create achievement (auth required)
- `PUT /api/achievements/:id` - Update achievement (auth required)
- `DELETE /api/achievements/:id` - Delete achievement (auth required)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List all messages (auth required)
- `DELETE /api/contact/:id` - Delete message (auth required)

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env` is correct
- Check PostgreSQL is running
- Ensure the database exists

### Prisma Errors
```bash
# Reset the database (WARNING: Deletes all data)
cd backend
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### Port Already in Use
If port 3000 or 5173 is already in use, you can change them:
- Backend: Update `PORT` in `backend/.env`
- Frontend: Update `vite.config.ts` in the frontend

### CORS Errors
The backend is configured to accept requests from `http://localhost:5173`. If you change the frontend port, update the CORS configuration in `backend/src/server.ts`.

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Uses `ts-node-dev` for automatic restart

### Database Changes
When you modify `schema.prisma`:
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### Viewing Database
```bash
cd backend
npx prisma studio
```

## Production Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Run `npm run build` to compile TypeScript
3. Run database migrations
4. Start with `npm start`

### Frontend Deployment
1. Update API URL in frontend code (or use environment variables)
2. Run `npm run build`
3. Deploy the `dist` folder to your hosting service

Recommended hosting platforms:
- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Supabase, Neon, Railway

## Support

For issues or questions:
1. Check the console for error messages
2. Review the API responses in browser DevTools
3. Check database state using Prisma Studio
4. Ensure all dependencies are installed

## License

This project is for portfolio use.
