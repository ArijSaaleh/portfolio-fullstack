# System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PORTFOLIO FULL-STACK APPLICATION                     │
│                         Complete System Architecture                         │
└─────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║                            PUBLIC INTERFACE                                ║
║                        (User-Facing Frontend)                              ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│  Browser: http://localhost:5173                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                          HOMEPAGE (/)                                │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  HERO SECTION                                                │  │  │
│  │  │  • Profile Photo & Name                                      │  │  │
│  │  │  • Title & Tagline                                           │  │  │
│  │  │  • CTA Buttons (Contact, View Projects)                      │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  ABOUT SECTION                                               │  │  │
│  │  │  • About Me Text                                             │  │  │
│  │  │  • Skills Grid                                               │  │  │
│  │  │  • Profile Image                                             │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  PROJECTS SECTION                                            │  │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │  │
│  │  │  │ Project 1  │  │ Project 2  │  │ Project 3  │  ...        │  │  │
│  │  │  │ [Image]    │  │ [Image]    │  │ [Image]    │             │  │  │
│  │  │  │ Title      │  │ Title      │  │ Title      │             │  │  │
│  │  │  │ Description│  │ Description│  │ Description│             │  │  │
│  │  │  │ [Details]  │  │ [Details]  │  │ [Details]  │             │  │  │
│  │  │  │ [GitHub]   │  │ [GitHub]   │  │ [GitHub]   │             │  │  │
│  │  │  │ [Live]     │  │ [Live]     │  │ [Live]     │             │  │  │
│  │  │  └────────────┘  └────────────┘  └────────────┘             │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                           │                                          │  │
│  │                           │ Click "View Details"                     │  │
│  │                           ▼                                          │  │
│  │              ┌───────────────────────────┐                          │  │
│  │              │  PROJECT DETAIL PAGE      │                          │  │
│  │              │  /project/:id             │                          │  │
│  │              │  • Full description       │                          │  │
│  │              │  • Challenge & Solution   │                          │  │
│  │              │  • Technologies           │                          │  │
│  │              │  • Image Gallery          │                          │  │
│  │              │  • Video Demo             │                          │  │
│  │              │  • GitHub & Live Links    │                          │  │
│  │              │  • [Back to Portfolio]    │                          │  │
│  │              └───────────────────────────┘                          │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  EXPERIENCE SECTION (Timeline)                               │  │  │
│  │  │         ●────────────────●────────────────●                  │  │  │
│  │  │         │   Experience 1  │   Experience 2  │   ...          │  │  │
│  │  │  [Logo] │   Company       │   Company       │                │  │  │
│  │  │         │   Position      │   Position      │                │  │  │
│  │  │         │   Location      │   Location      │                │  │  │
│  │  │         │   Dates         │   Dates         │                │  │  │
│  │  │         │   Description   │   Description   │                │  │  │
│  │  │         │   [Skills]      │   [Skills]      │                │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  ACHIEVEMENTS SECTION                                        │  │  │
│  │  │  [All] [Award] [Certification] [Participation] [Social]      │  │  │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                │  │  │
│  │  │  │Achievement│  │Achievement│  │Achievement│  ...            │  │  │
│  │  │  │ [Image]   │  │ [Image]   │  │ [Image]   │                │  │  │
│  │  │  │ Category  │  │ Category  │  │ Category  │                │  │  │
│  │  │  │ Title     │  │ Title     │  │ Title     │                │  │  │
│  │  │  │ Date      │  │ Date      │  │ Date      │                │  │  │
│  │  │  │ [Watch]   │  │ [Watch]   │  │ [Watch]   │                │  │  │
│  │  │  │ [View]    │  │ [View]    │  │ [View]    │                │  │  │
│  │  │  └───────────┘  └───────────┘  └───────────┘                │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  BLOG SECTION                                                │  │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐             │  │  │
│  │  │  │ Blog Post  │  │ Blog Post  │  │ Blog Post  │  ...        │  │  │
│  │  │  │ [Image]    │  │ [Image]    │  │ [Image]    │             │  │  │
│  │  │  │ Title      │  │ Title      │  │ Title      │             │  │  │
│  │  │  │ Excerpt    │  │ Excerpt    │  │ Excerpt    │             │  │  │
│  │  │  │ Type Badge │  │ Type Badge │  │ Type Badge │             │  │  │
│  │  │  │ Read Time  │  │ Read Time  │  │ Read Time  │             │  │  │
│  │  │  │ [Read More]│  │ [Read More]│  │ [Read More]│             │  │  │
│  │  │  └────────────┘  └────────────┘  └────────────┘             │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                           │                                          │  │
│  │                           │ Click "Read More"                        │  │
│  │                           ▼                                          │  │
│  │              ┌───────────────────────────┐                          │  │
│  │              │  BLOG DETAIL PAGE         │                          │  │
│  │              │  /blog/:slug              │                          │  │
│  │              │  • Featured image         │                          │  │
│  │              │  • Category & date        │                          │  │
│  │              │  • Read time              │                          │  │
│  │              │  • Full content           │                          │  │
│  │              │  • Video (if video type)  │                          │  │
│  │              │  • [Back to Portfolio]    │                          │  │
│  │              └───────────────────────────┘                          │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  CONTACT SECTION                                             │  │  │
│  │  │  Contact Form:                                               │  │  │
│  │  │  [ Name        ]                                             │  │  │
│  │  │  [ Email       ]                                             │  │  │
│  │  │  [ Message     ]                                             │  │  │
│  │  │  [  Submit  ]                                                │  │  │
│  │  │                                                              │  │  │
│  │  │  Social Links: [LinkedIn] [GitHub] [Email]                  │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  FOOTER                                                      │  │  │
│  │  │  © 2025 Arij SALEH. All Rights Reserved.                    │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘

                                    ║
                                    ║  HTTP Requests (Axios)
                                    ║  GET/POST/PUT/DELETE
                                    ▼

╔═══════════════════════════════════════════════════════════════════════════╗
║                          BACKEND API SERVER                                ║
║                     Node.js + Express + TypeScript                         ║
║                    http://localhost:3000/api                               ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  AUTHENTICATION MIDDLEWARE                                          │  │
│  │  • Verify JWT tokens                                                │  │
│  │  • Protect admin routes                                             │  │
│  │  • Return 401 if unauthorized                                       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  API ROUTES                                                          │  │
│  │                                                                      │  │
│  │  /api/auth                                                           │  │
│  │    POST   /login           → Authenticate & return JWT              │  │
│  │                                                                      │  │
│  │  /api/projects                                                       │  │
│  │    GET    /                → List all published projects (public)   │  │
│  │    GET    /:id             → Get project details (public)           │  │
│  │    POST   /                → Create project (🔒 auth required)      │  │
│  │    PUT    /:id             → Update project (🔒 auth required)      │  │
│  │    DELETE /:id             → Delete project (🔒 auth required)      │  │
│  │                                                                      │  │
│  │  /api/blogs                                                          │  │
│  │    GET    /                → List all published blogs (public)      │  │
│  │    GET    /:id             → Get blog details (public)              │  │
│  │    POST   /                → Create blog (🔒 auth required)         │  │
│  │    PUT    /:id             → Update blog (🔒 auth required)         │  │
│  │    DELETE /:id             → Delete blog (🔒 auth required)         │  │
│  │                                                                      │  │
│  │  /api/experiences                                                    │  │
│  │    GET    /                → List all experiences (public)          │  │
│  │    GET    /:id             → Get experience details (public)        │  │
│  │    POST   /                → Create experience (🔒 auth required)   │  │
│  │    PUT    /:id             → Update experience (🔒 auth required)   │  │
│  │    DELETE /:id             → Delete experience (🔒 auth required)   │  │
│  │                                                                      │  │
│  │  /api/achievements                                                   │  │
│  │    GET    /                → List all published achievements        │  │
│  │    GET    /:id             → Get achievement details (public)       │  │
│  │    POST   /                → Create achievement (🔒 auth required)  │  │
│  │    PUT    /:id             → Update achievement (🔒 auth required)  │  │
│  │    DELETE /:id             → Delete achievement (🔒 auth required)  │  │
│  │                                                                      │  │
│  │  /api/contact                                                        │  │
│  │    POST   /                → Submit contact form (public)           │  │
│  │    GET    /                → List all messages (🔒 auth required)   │  │
│  │    DELETE /:id             → Delete message (🔒 auth required)      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘

                                    ║
                                    ║  Prisma ORM
                                    ║  SQL Queries
                                    ▼

╔═══════════════════════════════════════════════════════════════════════════╗
║                         PostgreSQL DATABASE                                ║
║                    postgresql://localhost:5432/portfolio_db                ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │   User       │  │   Project    │  │   Blog       │                    │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤                    │
│  │ id           │  │ id           │  │ id           │                    │
│  │ email        │  │ title        │  │ title        │                    │
│  │ password     │  │ description  │  │ slug         │                    │
│  │ createdAt    │  │ challenge    │  │ excerpt      │                    │
│  │ updatedAt    │  │ contribution │  │ content      │                    │
│  └──────────────┘  │ thumbnail    │  │ type         │                    │
│                    │ heroImage    │  │ readTime     │                    │
│                    │ technologies │  │ image        │                    │
│                    │ images       │  │ videoUrl     │                    │
│                    │ githubUrl    │  │ publishedDate│                    │
│                    │ liveUrl      │  │ published    │                    │
│                    │ videoUrl     │  │ createdAt    │                    │
│                    │ accuracy     │  │ updatedAt    │                    │
│                    │ speed        │  └──────────────┘                    │
│                    │ published    │                                       │
│                    │ createdAt    │  ┌──────────────┐                    │
│                    │ updatedAt    │  │ Experience   │                    │
│                    └──────────────┘  ├──────────────┤                    │
│                                      │ id           │                    │
│  ┌──────────────┐  ┌──────────────┐  │ company      │                    │
│  │ Achievement  │  │ContactMessage│  │ companyLogo  │                    │
│  ├──────────────┤  ├──────────────┤  │ position     │                    │
│  │ id           │  │ id           │  │ location     │                    │
│  │ title        │  │ name         │  │ startDate    │                    │
│  │ description  │  │ email        │  │ endDate      │                    │
│  │ category     │  │ message      │  │ current      │                    │
│  │ date         │  │ createdAt    │  │ description  │                    │
│  │ images       │  └──────────────┘  │ skills       │                    │
│  │ videoUrl     │                    │ createdAt    │                    │
│  │ link         │                    │ updatedAt    │                    │
│  │ published    │                    └──────────────┘                    │
│  │ createdAt    │                                                         │
│  │ updatedAt    │                                                         │
│  └──────────────┘                                                         │
└───────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

╔═══════════════════════════════════════════════════════════════════════════╗
║                           ADMIN INTERFACE                                  ║
║                      (Protected, Authenticated)                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│  Browser: http://localhost:5173/admin                                     │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  LOGIN PAGE (/admin/login)                                          │  │
│  │  ┌───────────────────────────────────────┐                          │  │
│  │  │  Admin Login                          │                          │  │
│  │  │  ┌─────────────────────────────────┐  │                          │  │
│  │  │  │ Email:    [________________]    │  │                          │  │
│  │  │  │ Password: [________________]    │  │                          │  │
│  │  │  │           [     Login     ]     │  │                          │  │
│  │  │  └─────────────────────────────────┘  │                          │  │
│  │  └───────────────────────────────────────┘                          │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                            │                                               │
│                            │ After successful login                        │
│                            ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  ADMIN DASHBOARD (/admin/dashboard)                                 │  │
│  │  [Back] Admin Dashboard                            [Logout]         │  │
│  │  ┌─────┐ ┌─────┐ ┌────────┐ ┌────────────┐ ┌─────────┐            │  │
│  │  │  5  │ │  3  │ │   2    │ │     4      │ │    2    │            │  │
│  │  │Proj │ │Blogs│ │ Exp    │ │ Achieve    │ │ Messages│            │  │
│  │  └─────┘ └─────┘ └────────┘ └────────────┘ └─────────┘            │  │
│  │                                                                      │  │
│  │  Management Cards:                                                  │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │  │
│  │  │ Projects     │ │ Blogs        │ │ Experiences  │               │  │
│  │  │ Manage all   │ │ Manage all   │ │ Manage all   │               │  │
│  │  │ projects     │ │ blog posts   │ │ work history │               │  │
│  │  │ [  Manage  ] │ │ [  Manage  ] │ │ [  Manage  ] │               │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │  │
│  │  │Achievements  │ │ Messages     │ │ Portfolio    │               │  │
│  │  │ Manage all   │ │ View contact │ │ View public  │               │  │
│  │  │ achievements │ │ submissions  │ │ portfolio    │               │  │
│  │  │ [  Manage  ] │ │ [   View   ] │ │ [   View   ] │               │  │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  ADMIN PROJECTS (/admin/projects)                                   │  │
│  │  [Back to Dashboard]                                  [Logout]      │  │
│  │                                                                      │  │
│  │  Add New Project:                                                   │  │
│  │  [ Title         ] [ Description    ]                               │  │
│  │  [ Challenge (textarea)            ]                                │  │
│  │  [ Contribution (textarea)         ]                                │  │
│  │  [ Technologies: React [x] Node [x] +Add ]                          │  │
│  │  [ Thumbnail URL  ] [ Hero Image URL ]                              │  │
│  │  [ Gallery: img1.jpg [x] +Add ]                                     │  │
│  │  [ GitHub URL     ] [ Live URL       ]                              │  │
│  │  [ Video URL      ]                                                 │  │
│  │  [ Accuracy: 98%  ] [ Speed: 20x     ]                              │  │
│  │  ☑ Published      [  Create Project  ]                              │  │
│  │                                                                      │  │
│  │  Existing Projects:                                                 │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │ [img] Drone Navigation      [Published] [Edit] [Delete]       │ │  │
│  │  │       Automated task planning...                               │ │  │
│  │  │       Tech: C++, ROS, Computer Vision                          │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │ [img] IoT Gateway          [Draft] [Edit] [Delete]            │ │  │
│  │  │       Cloud-based monitoring...                                │ │  │
│  │  │       Tech: Node.js, MQTT, MongoDB                             │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  [Similar interfaces for:]                                                │
│  • Admin Blogs (/admin/blogs)                                             │
│  • Admin Experiences (/admin/experiences)                                 │
│  • Admin Achievements (/admin/achievements)                               │
│  • Admin Messages (/admin/messages)                                       │
└───────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

                          DATA FLOW VISUALIZATION

┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  Public  │────────▶│ Frontend │────────▶│ Backend  │────────▶│ Database │
│  Visitor │ Browse  │  React   │ API Call│  Express │  Query  │PostgreSQL│
└──────────┘         └──────────┘         └──────────┘         └──────────┘
                           │                    │                    │
                           │                    │                    │
                           │◀───────────────────┤◀───────────────────┤
                           │      JSON Data     │    Query Results   │
                           │                    │                    │
                           ▼                    │                    │
                     ┌──────────┐               │                    │
                     │  Render  │               │                    │
                     │   View   │               │                    │
                     └──────────┘               │                    │
                                                │                    │
┌──────────┐         ┌──────────┐         ┌──────────┐              │
│  Admin   │────────▶│ Frontend │────────▶│ Backend  │              │
│   User   │  Login  │  React   │  POST   │  Express │              │
└──────────┘         └──────────┘         └──────────┘              │
     │                     │                    │                    │
     │                     │◀───────────────────┤                    │
     │                     │    JWT Token       │                    │
     │                     │                    │                    │
     │ Add/Edit            │                    │                    │
     ├────────────────────▶│ POST/PUT           │                    │
     │  Content            ├───────────────────▶│ Validate JWT       │
     │                     │ + JWT Token        │ & Update DB        │
     │                     │                    ├───────────────────▶│
     │                     │                    │   INSERT/UPDATE    │
     │                     │                    │◀───────────────────┤
     │                     │◀───────────────────┤   Success          │
     │                     │   Updated Data     │                    │
     │◀────────────────────┤                    │                    │
     │   View Updated      │                    │                    │

═══════════════════════════════════════════════════════════════════════════

                         TECHNOLOGY STACK LAYERS

┌───────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │   React    │ │ TypeScript │ │  Tailwind  │ │  shadcn/ui │            │
│  │   18.2.0   │ │   5.2.2    │ │  CSS 3.4   │ │  (Radix)   │            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘            │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │   Node.js  │ │  Express   │ │ TypeScript │ │    JWT     │            │
│  │            │ │   4.18.2   │ │   5.3.3    │ │  (Auth)    │            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘            │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS LAYER                                 │
│  ┌────────────┐ ┌────────────┐                                            │
│  │   Prisma   │ │  bcryptjs  │                                            │
│  │  ORM 5.8   │ │  (Crypto)  │                                            │
│  └────────────┘ └────────────┘                                            │
└───────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                     │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       PostgreSQL                                   │   │
│  │  Tables: User, Project, Blog, Experience, Achievement, Messages   │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

                           PROJECT STATISTICS

┌───────────────────────────────────────────────────────────────────────────┐
│  Total Components: 25+         │  Backend Routes: 6                       │
│  React Pages: 11               │  API Endpoints: 26                       │
│  Database Models: 6            │  Lines of Code: 5000+                    │
│  Documentation Files: 7        │  Tech Stack Items: 20+                   │
└───────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
```

**Legend:**
- 🔒 = Authentication Required
- [x] = Removable item in array
- +Add = Add new item button
- ☑ = Checkbox
- [Button] = Clickable button
- ▶ = Data flow direction
- ◀ = Response flow direction

**Status:** ✅ Production Ready
**Version:** 2.0.0
**Last Updated:** January 2025
