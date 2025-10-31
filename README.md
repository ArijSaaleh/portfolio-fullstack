# Portfolio Full-Stack Application

A modern, professional full-stack portfolio website built with React, TypeScript, Node.js, PostgreSQL, and Prisma ORM. Features a beautiful, responsive frontend with TailwindCSS and shadcn/ui components, plus a comprehensive admin panel for complete content management.

Perfect for developers, engineers, and professionals who want a customizable, database-driven portfolio with blog, project showcase, work experience timeline, achievements section, and contact form.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **TailwindCSS** for styling
- **shadcn/ui** for beautiful UI components
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database management
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
portfolio-fullstack/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utility functions
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd portfolio-fullstack
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials:
# DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
# JWT_SECRET="your-super-secret-jwt-key"
# PORT=3000

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/edit database
npm run prisma:studio

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:3000`

## 📝 Database Setup

### Create PostgreSQL Database

```bash
# Using psql
psql -U postgres

# Create database
CREATE DATABASE portfolio_db;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO your_username;
```

### Create Admin User

After setting up the backend, create an admin user:

```bash
# Using curl or any API client
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "yourSecurePassword",
    "name": "Admin User"
  }'
```

## 🎯 Features

### Public Features
- ✅ **Hero section** with call-to-action
- ✅ **About section** with skills and expertise
- ✅ **Projects showcase** with GitHub and Live Demo links
- ✅ **Work Experience timeline** with company logos
- ✅ **Achievements & Certifications** section
- ✅ **Blog posts** with full detail pages
- ✅ **Contact form** with email notifications
- ✅ **Fully responsive** design for all devices
- ✅ **Project detail pages** with galleries and videos
- ✅ **Blog detail pages** with rich content

### Admin Features
- ✅ **Secure login** with JWT authentication
- ✅ **Admin Dashboard** with statistics and quick navigation
- ✅ **Complete CRUD operations** for:
  - **Projects** (with GitHub links, live URLs, videos, galleries)
  - **Blog posts** (with auto-slugs, read time, video embeds)
  - **Experiences** (with company logos, skills, dates)
  - **Achievements** (with categories, images, videos, links)
  - **Contact messages** (view and manage submissions)
- ✅ **Inline editing** for quick updates
- ✅ **Published status** toggle for all content
- ✅ **Rich media support** (images, videos, external links)
- ✅ **Category filtering** and organization
- ✅ **Image preview** before saving

## 🔐 API Endpoints

### Public Endpoints
```
GET    /api/projects          - Get all published projects
GET    /api/projects/:id      - Get single project details
GET    /api/blogs             - Get all published blog posts
GET    /api/blogs/:id         - Get single blog post
GET    /api/experiences       - Get all work experiences
GET    /api/achievements      - Get all published achievements
POST   /api/contact           - Submit contact form
```

### Protected Endpoints (require JWT)
```
POST   /api/auth/login        - Login admin user

POST   /api/projects          - Create project
PUT    /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project

POST   /api/blogs             - Create blog post
PUT    /api/blogs/:id         - Update blog post
DELETE /api/blogs/:id         - Delete blog post

POST   /api/experiences       - Create experience
PUT    /api/experiences/:id   - Update experience
DELETE /api/experiences/:id   - Delete experience

POST   /api/achievements      - Create achievement
PUT    /api/achievements/:id  - Update achievement
DELETE /api/achievements/:id  - Delete achievement

GET    /api/contact           - Get all messages
DELETE /api/contact/:id       - Delete message
```

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Update environment variables:
```
VITE_API_URL=https://your-backend-url.com
```

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables:
```
DATABASE_URL=your-production-postgresql-url
JWT_SECRET=your-production-secret
PORT=3000
```

2. Build and start:
```bash
cd backend
npm run build
npm start
```

### Database Deployment

Use services like:
- **Railway** (easiest)
- **Supabase**
- **Neon**
- **AWS RDS**

## 📚 Environment Variables

### Backend `.env`
```env
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Frontend `.env` (optional)
```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Customization

### Update Personal Information

1. Edit `frontend/src/components/Hero.tsx` - Update name, title, description
2. Edit `frontend/src/components/About.tsx` - Update about text and skills
3. Edit `frontend/src/components/Contact.tsx` - Update social links
4. Replace placeholder images in `/public` folder

### Color Theme

Edit `frontend/src/index.css` to change the color scheme:
```css
:root {
  --primary: 156 25% 49%;  /* Sage green */
  --secondary: 0 0% 75%;   /* Silver */
  /* ... other colors */
}
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists and user has permissions

### Port Already in Use
```bash
# Change PORT in backend/.env
# Change port in frontend/vite.config.ts
```

### CORS Issues
- Ensure backend CORS is configured for your frontend URL
- Check `backend/src/server.ts` cors configuration

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👤 Author

**Arij SALEH**

---

Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL
