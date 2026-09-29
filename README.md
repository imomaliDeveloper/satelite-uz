# 🛰️ SATELITE.UZ - Digital Examination & Question-Bank Platform

> *"Prepare smarter. Practice better. Reach your goal."*

**SATELITE.UZ** is a production-ready, full-stack digital examination preparation and question-bank platform inspired by modern digital SAT systems. It features an original visual identity with a futuristic 3D satellite orbit aesthetic, an interactive student training ground, and a comprehensive educator admin panel requiring zero code changes to curate questions.

---

## 🌟 Key Product Features

### 🎓 Student Experience
- **Interactive Practice Mode**: Question-by-question adaptive solving, instant answer checking, and comprehensive step-by-step explanations.
- **Realistic Timed Digital Exam Simulator**: Authentic examination interface with live countdown timer, visual urgency indicators (<5 min pulse), question matrix navigation panel ($1..N$), mark-for-review flags, and auto-submit on timeout.
- **Mastery Telemetry & Analytics**: Visual progress ring, topic-by-topic accuracy breakdown (e.g. *Algebra: 78%*, *Geometry: 62%*), weak topic targeting, and personalized streak tracking.
- **Searchable Question Bank**: Real-time debounced keyword search, multi-faceted filtering by Subject, Topic, Difficulty (Easy, Medium, Hard), and Question Type. Public APIs securely withhold correct answers before submission.
- **Saved Bookmarks & Review**: Instant bookmarking of challenging questions, review of missed answers, and historical performance tracking.

### 🛡️ Administrator Operations Center
- **Zero-Code Question Management**: Create, edit, publish, draft, or delete questions directly from the browser without modifying source code.
- **Real-Time Live Question Preview**: Real-time split-screen preview that renders exactly what students will see as questions and options are typed.
- **Image & Diagram Uploads**: Secure file upload system with Multer (PNG, JPG, JPEG, WEBP validation and file size limits).
- **Taxonomy Management**: Full CRUD operations for academic Subjects (Mathematics, Reading & Writing) and Topics (Algebra, Advanced Math, Geometry, Problem Solving, Information & Ideas, Craft & Structure, Expression of Ideas, Conventions).
- **Exam Blueprint Builder**: Multi-select questions from the bank, customize test durations, set sequence ordering, and publish exams.
- **User Governance & Role Protection**: Promote/demote users, activate/deactivate accounts, with an automated guard that prevents removing the last administrator.
- **Bulk Question Importer**: CSV/JSON ingestion pipeline with one-click sample template download.
- **Platform Analytics**: Difficulty curves, subject popularity metrics, most difficult topics, and most frequently missed questions.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 & Vanilla JavaScript**: Pure client-side code without heavy framework overhead.
- **Modern CSS3**: Custom design system with CSS custom properties, glassmorphism, responsive breakpoints, and dark/light theme switching with `localStorage` persistence.
- **Three.js**: Lightweight, procedural 3D satellite, core orb, atmosphere glow, and starfield with smooth mouse parallax and reduced-motion fallbacks.

### Backend
- **Node.js & Express.js**: Modular REST API with ES Modules.
- **Prisma ORM**: Type-safe relational modeling with PostgreSQL (and local file database support).
- **Authentication & Security**:
  - Stateless JSON Web Tokens (JWT)
  - Password hashing with bcrypt
  - `helmet` security headers with customized CSP
  - `cors` cross-origin resource sharing
  - `express-rate-limit` DDoS and brute-force protection
  - `zod` schema input validation
  - Centralized error handling and structured JSON responses
- **Documentation**: Interactive OpenAPI / Swagger UI served at `/api-docs`.

---

## 📁 Project Architecture

```
satelite-uz/
├── frontend/
│   ├── index.html                 # 3D Orbit Landing Page
│   ├── login.html                 # 3D Split Screen Authentication
│   ├── register.html              # Student Registration
│   ├── forgot-password.html       # Password Recovery
│   ├── dashboard.html             # Student Command Center & KPIs
│   ├── question-bank.html         # Search & Filter Question Catalog
│   ├── practice.html              # Question-by-Question Interactive Mode
│   ├── exam.html                  # Full-Length Timed Exam Simulator
│   ├── results.html               # Exam Results & Topic Telemetry
│   ├── review.html                # Detailed Answer Comparison
│   ├── profile.html               # Profile, Streak, Bookmarks & History
│   ├── bookmarks.html             # Saved Questions Redirect
│   │
│   ├── admin/
│   │   ├── index.html             # Admin Login Portal
│   │   ├── dashboard.html         # Operations Dashboard
│   │   ├── questions.html         # Question Bank Table
│   │   ├── question-create.html   # Add Question with Live Preview
│   │   ├── question-edit.html     # Edit Question with Live Preview
│   │   ├── subjects.html          # Subject Domain Management
│   │   ├── topics.html            # Topic Taxonomy Management
│   │   ├── exams.html             # Exam Builder & Question Picker
│   │   ├── users.html             # User Governance & Role Controls
│   │   ├── analytics.html         # Learning Analytics & Miss Rates
│   │   └── settings.html          # Bulk CSV/JSON Importer & Settings
│   │
│   ├── css/
│   │   ├── global.css             # Theme variables, typography, buttons, modals, toasts
│   │   ├── auth.css               # Split 3D canvas auth layouts
│   │   ├── dashboard.css          # Student dashboard widgets and progress ring
│   │   ├── practice.css           # Option cards and explanation animations
│   │   ├── exam.css               # Full-screen simulator, timer & question matrix
│   │   ├── admin.css              # Admin sidebar, tables, and live preview layout
│   │   └── responsive.css         # Multi-device breakpoints
│   │
│   └── js/
│       ├── api.js                 # Centralized fetch client with token handling
│       ├── auth.js                # Auth session state & route guards
│       ├── theme.js               # Dark/Light theme switcher
│       ├── toast.js               # Toast notification system
│       ├── hero-3d.js             # Three.js 3D satellite & orbit scene
│       ├── dashboard.js           # Dashboard controller
│       ├── question-bank.js       # Debounced search & filter controller
│       ├── practice.js            # Practice answering & instant explanations
│       ├── exam.js                # Exam timer, matrix, and auto-submit
│       ├── results.js             # Score summary and topic bar charts
│       ├── review.js              # Question-by-question review
│       ├── profile.js             # Personal telemetry & saved bookmarks
│       └── admin/
│           ├── admin.js           # Shared admin navigation & auth guards
│           ├── questions.js       # Admin question table controller
│           ├── question-form.js   # Live preview editor & image upload
│           ├── subjects.js        # Subject CRUD controller
│           ├── topics.js          # Topic CRUD controller
│           ├── exams.js           # Exam blueprint builder
│           ├── users.js           # User roles & account status toggle
│           ├── analytics.js       # Analytics controller
│           └── settings.js        # CSV/JSON bulk importer controller
│
├── backend/
│   ├── src/
│   │   ├── config/                # Database and Swagger config
│   │   ├── controllers/           # Business logic controllers
│   │   ├── middleware/            # Auth, rate limiting, multer, error handler
│   │   ├── routes/                # Express API routes
│   │   ├── utils/                 # JWT, bcrypt, and seed generator
│   │   ├── validators/            # Zod validation schemas
│   │   └── server.js              # Server entrypoint
│   │
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema models & relations
│   │   └── prepare-db.js          # Multi-provider setup utility
│   │
│   ├── tests/
│   │   ├── api.test.js            # Integration test suite (14 tests)
│   │   └── e2e-scenario.test.js   # Full 23-point end-to-end workflow test
│   │
│   ├── uploads/                   # Stored question image assets
│   ├── package.json
│   └── .env.example
│
├── package.json                   # Root workspace scripts
└── README.md
```

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- PostgreSQL (Production) or local SQLite (automatically detected)

### 2. Clone & Install Dependencies
From the project root:
```bash
npm --prefix backend install
```

### 3. Setup Database Schema
Sync the database models:
```bash
npm run prisma:push
npm run prisma:generate
```

### 4. Seed Initial Data
Seed the administrator account, subjects, topics, sample questions, and diagnostic exams:
```bash
npm run seed
```

### 5. Launch the Platform
Start the platform in development mode:
```bash
npm run dev
```
Or in production mode:
```bash
npm start
```

Open your browser at:
- **Web Platform**: [http://localhost:5000](http://localhost:5000)
- **Admin Portal**: [http://localhost:5000/admin/](http://localhost:5000/admin/)
- **Interactive Swagger Docs**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

## 🔑 Test Credentials (Local Development)

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@satelite.uz` | `ChangeMe123!` |
| **Student** | `student@satelite.uz` | `StudentPass123!` |

> [!WARNING]
> Change the default administrator password immediately when deploying to a public or production environment!

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in `backend/.env` (see `backend/.env.example`):

```ini
# PostgreSQL Connection String (Production)
DATABASE_URL="postgresql://username:password@localhost:5432/satelite_db?schema=public"

# For Zero-Config Local Development without a running PostgreSQL daemon:
# DATABASE_URL="file:./dev.db"

# JWT Secret & Expiration
JWT_SECRET="satelite_uz_super_secret_jwt_key_2026_exam_platform_secure_token"
JWT_EXPIRES_IN="7d"

# Server Port & Environment
PORT=5000
NODE_ENV="development"

# Client URL (for CORS)
CLIENT_URL="http://localhost:5000"

# Uploads directory
UPLOAD_DIR="./uploads"
```

---

## 🧪 Automated Testing

The platform includes a built-in automated test suite covering all authentication, authorization guards, question CRUD, practice checks, exam timing, bookmarks, and the full 23-point end-to-end user scenario:

Run all tests:
```bash
npm test
```

All 27 integration tests will execute against the API and output passing status.

---

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in your server environment.
2. Supply your managed PostgreSQL URI to `DATABASE_URL`.
3. Set a cryptographically secure random string for `JWT_SECRET`.
4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Seed database (first run only):
   ```bash
   npm run seed
   ```
6. Start process with PM2 or Docker:
   ```bash
   node backend/src/server.js
   ```

---

## 📄 License
Original educational examination platform architecture built for **SATELITE.UZ**.
All rights reserved © 2026.
