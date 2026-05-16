# Smart Leads Dashboard

> A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, TailwindCSS, and Docker.

**Live Demo:** [smart-leads-dashboard-gules.vercel.app](https://smart-leads-dashboard-gules.vercel.app)

**Demo Credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@smartleads.com | admin123 |
| Sales | sales@smartleads.com | sales123 |

---

## Features

| Feature | Details |
|---|---|
| ✅ JWT Authentication | Register, login, protected routes, auth middleware |
| ✅ Password Hashing | bcrypt with salt rounds 12 |
| ✅ Role-Based Access Control | Admin sees all leads; Sales sees own leads only |
| ✅ Full Leads CRUD | Create, Read, Update, Delete with validation |
| ✅ Advanced Filtering | Filter by status, source; search by name/email; sort latest/oldest |
| ✅ Multi-filter Support | All filters work together simultaneously |
| ✅ Debounced Search | 400ms debounce prevents excessive API calls |
| ✅ Backend Pagination | skip/limit with metadata (total, pages, hasNext, hasPrev) |
| ✅ CSV Export | Export filtered results as downloadable CSV |
| ✅ Loading States | Shimmer skeleton loaders, spinner buttons |
| ✅ Empty States | Friendly empty state UI with icon |
| ✅ Error Handling | Global error handler, form validation errors, toast notifications |
| ✅ Responsive Design | Works on mobile, tablet, desktop |
| ✅ Docker Setup | Full docker-compose with mongo, backend, frontend (nginx) |
| ✅ Dark / Light Mode | Toggle with persistence via localStorage (Bonus) |

---

## Tech Stack

**Frontend**
- React 19 + TypeScript (strict mode)
- TailwindCSS v4
- TanStack Query v5 (server state, caching)
- Zustand (auth + theme state)
- React Router v7
- Axios
- React Hot Toast

**Backend**
- Node.js + Express + TypeScript (strict mode)
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- express-validator
- Morgan (logging)

**DevOps**
- Docker + Docker Compose
- Nginx (frontend production serving)
- MongoDB Atlas (cloud database)
- Railway (backend hosting)
- Vercel (frontend hosting)

---

## Project Structure

```
Smart-Leads-Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts           # App config (port, JWT, DB)
│   │   │   └── database.ts        # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts  # Register, login, getMe
│   │   │   └── leadsController.ts # CRUD, export CSV, stats
│   │   ├── middleware/
│   │   │   ├── auth.ts            # authenticate + authorize(roles)
│   │   │   ├── validation.ts      # express-validator rules
│   │   │   └── errorHandler.ts    # Global error handler + 404
│   │   ├── models/
│   │   │   ├── User.ts            # User schema + bcrypt pre-save
│   │   │   └── Lead.ts            # Lead schema + indexes
│   │   ├── routes/
│   │   │   ├── auth.ts            # /api/v1/auth/*
│   │   │   ├── leads.ts           # /api/v1/leads/*
│   │   │   └── users.ts           # /api/v1/users/* (admin only)
│   │   ├── types/
│   │   │   └── index.ts           # Shared TypeScript interfaces
│   │   └── utils/
│   │       ├── jwt.ts             # generateToken, verifyToken
│   │       ├── response.ts        # sendSuccess, sendError helpers
│   │       └── seed.ts            # Database seeder script
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nixpacks.toml
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.tsx   # Route guards
│   │   │   ├── layout/
│   │   │   │   ├── Layout.tsx           # App shell
│   │   │   │   └── Sidebar.tsx          # Nav + theme toggle + user
│   │   │   ├── leads/
│   │   │   │   ├── LeadsTable.tsx       # Table with edit/delete/view
│   │   │   │   ├── LeadForm.tsx         # Create/edit form
│   │   │   │   ├── LeadsFiltersBar.tsx  # Debounced search + filters
│   │   │   │   └── Pagination.tsx       # Page controls + metadata
│   │   │   └── ui/
│   │   │       ├── Badge.tsx            # StatusBadge, SourceBadge
│   │   │       ├── Button.tsx           # Reusable button variants
│   │   │       ├── Input.tsx            # Labeled input with errors
│   │   │       ├── Modal.tsx            # Accessible modal dialog
│   │   │       └── Select.tsx           # Styled select dropdown
│   │   ├── hooks/
│   │   │   ├── useLeads.ts             # TanStack Query lead hooks
│   │   │   └── useAuth.ts              # Login/register mutations
│   │   ├── lib/
│   │   │   ├── api.ts                  # Axios instance + interceptors
│   │   │   └── utils.ts                # cn(), formatDate()
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx       # Stats overview
│   │   │   ├── LeadsPage.tsx           # Full leads management
│   │   │   ├── LoginPage.tsx           # Auth login
│   │   │   └── RegisterPage.tsx        # Auth register
│   │   ├── store/
│   │   │   ├── authStore.ts            # Zustand auth state
│   │   │   └── themeStore.ts           # Zustand dark/light theme
│   │   ├── types/
│   │   │   └── index.ts                # Shared TypeScript interfaces
│   │   ├── App.tsx                     # Router + providers
│   │   ├── main.tsx                    # Entry point
│   │   └── index.css                   # Tailwind + CSS theme vars
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local) or MongoDB Atlas (cloud)
- Docker & Docker Compose (for Option B)

---

### Option A — Local Development

#### 1. Clone the repo
```bash
git clone https://github.com/Niranjan-SE/Smart-Leads-Dashboard.git
cd Smart-Leads-Dashboard
```

#### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env — add your MONGODB_URI and JWT_SECRET (see env table below)
npm install
npm run dev
# Backend runs on http://localhost:5000
```

#### 3. Seed the database
```bash
# In the backend directory (while dev server is NOT running, or in a new terminal)
npm run seed
```
Output:
```
✅ MongoDB Connected
✅ Seed completed!
👤 Admin: admin@smartleads.com / admin123
👤 Sales: sales@smartleads.com / sales123
```

#### 4. Frontend setup
```bash
cd ../frontend
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

### Option B — Docker Compose

```bash
# From project root
cp backend/.env.example backend/.env
# Edit backend/.env with your values

docker-compose up --build
```

Then seed the database:
```bash
docker exec smart-leads-backend node dist/utils/seed.js
```

App runs at **http://localhost** (port 80)

---

## Environment Variables

### Backend `.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment (`development` / `production`) |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret for JWT signing (use hex string, no special chars) |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiry |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS |

Generate a safe JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend `.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | — | Backend API base URL |

---

## API Documentation

**Production Base URL:** `https://smart-leads-dashboard-production.up.railway.app/api/v1`

**Local Base URL:** `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <token>`

---

### Auth Endpoints

#### `POST /auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    }
  }
}
```

---

#### `POST /auth/login`
Login with credentials.

**Body:**
```json
{
  "email": "admin@smartleads.com",
  "password": "admin123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Admin User", "role": "admin" }
  }
}
```

---

#### `GET /auth/me` 🔒
Get current authenticated user profile.

---

### Leads Endpoints

#### `GET /leads` 🔒
Get paginated leads with optional filters.

**Query Parameters:**

| Param | Type | Values | Default |
|---|---|---|---|
| `page` | number | any | `1` |
| `limit` | number | any | `10` |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` | — |
| `source` | string | `Website`, `Instagram`, `Referral` | — |
| `search` | string | any | — |
| `sort` | string | `latest`, `oldest` | `latest` |

**Example with multiple filters:**
```
GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Follow up needed",
      "createdBy": { "name": "Admin User", "email": "admin@smartleads.com" },
      "createdAt": "2026-05-16T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### `GET /leads/stats` 🔒
Get lead counts grouped by status and source.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 12,
    "byStatus": { "New": 4, "Contacted": 3, "Qualified": 3, "Lost": 2 },
    "bySource": { "Website": 5, "Instagram": 4, "Referral": 3 }
  }
}
```

---

#### `GET /leads/export` 🔒
Export leads as CSV file. Accepts same filter params as `GET /leads`.

Returns `text/csv` download with filename `leads-YYYY-MM-DD.csv`.

---

#### `GET /leads/:id` 🔒
Get a single lead by ID.

---

#### `POST /leads` 🔒
Create a new lead.

**Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in premium plan"
}
```

**Response `201`:** Returns the created lead object.

---

#### `PATCH /leads/:id` 🔒
Partially update a lead. All fields optional.

**Body (any combination):**
```json
{
  "status": "Qualified",
  "notes": "Ready to close"
}
```

---

#### `DELETE /leads/:id` 🔒
Delete a lead. Sales users can only delete their own leads.

**Response `200`:**
```json
{ "success": true, "message": "Lead deleted successfully", "data": null }
```

---

### Users Endpoints (Admin Only)

#### `GET /users` 🔒 Admin
List all registered users.

#### `PATCH /users/:id/role` 🔒 Admin
Update a user's role.

**Body:** `{ "role": "admin" }`

---

### Error Response Format

All errors follow this structure:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

**HTTP Status Codes used:**
| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized |
| `403` | Forbidden (wrong role) |
| `404` | Not Found |
| `409` | Conflict (duplicate email) |
| `500` | Internal Server Error |

---

## Role-Based Access Control

| Action | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ❌ (own only) |
| View own leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Edit any lead | ✅ | ❌ (own only) |
| Delete any lead | ✅ | ❌ (own only) |
| View stats | ✅ (all) | ✅ (own) |
| Export CSV | ✅ (all) | ✅ (own) |
| Manage users | ✅ | ❌ |

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [smart-leads-dashboard-gules.vercel.app](https://smart-leads-dashboard-gules.vercel.app) |
| Backend | Railway | [smart-leads-dashboard-production.up.railway.app](https://smart-leads-dashboard-production.up.railway.app) |
| Database | MongoDB Atlas | Cloud hosted |

### Deploy Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set Root Directory: `frontend`
3. Add env var: `VITE_API_URL=https://your-railway-url.up.railway.app/api/v1`
4. Deploy

### Deploy Backend (Railway)
1. Connect GitHub repo to Railway
2. Set Root Directory: `backend`
3. Add all env vars from the table above
4. Deploy

---

## Git Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Build/config/tooling changes |
| `refactor:` | Code restructuring without feature change |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |

---

## License

MIT © [Niranjan](https://github.com/Niranjan-SE)
