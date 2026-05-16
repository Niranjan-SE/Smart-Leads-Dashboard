# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, TailwindCSS, and Docker — featuring JWT auth, RBAC, advanced filtering, debounced search, pagination, and CSV export.

---

## Tech Stack

**Frontend**
- React 19 + TypeScript
- TailwindCSS v4
- TanStack Query (data fetching & caching)
- Zustand (auth state)
- React Router v6
- React Hot Toast

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- express-validator

**DevOps**
- Docker + Docker Compose
- Nginx (frontend serving)

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
| ✅ Loading States | Skeleton loaders, spinner buttons |
| ✅ Empty States | Friendly empty state UI |
| ✅ Error Handling | Global error handler, form validation errors, toast notifications |
| ✅ Responsive Design | Works on mobile, tablet, desktop |
| ✅ Docker Setup | Full docker-compose with mongo, backend, frontend |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, app config
│   │   ├── controllers/     # authController, leadsController
│   │   ├── middleware/       # auth, validation, errorHandler
│   │   ├── models/          # User, Lead (Mongoose schemas)
│   │   ├── routes/          # auth, leads, users
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # jwt, response helpers, seed
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute, PublicRoute
│   │   │   ├── layout/      # Sidebar, Layout
│   │   │   ├── leads/       # LeadsTable, LeadForm, FiltersBar, Pagination
│   │   │   └── ui/          # Button, Input, Select, Modal, Badge
│   │   ├── hooks/           # useLeads, useAuth (TanStack Query)
│   │   ├── lib/             # axios client, utils (cn, formatDate)
│   │   ├── pages/           # DashboardPage, LeadsPage, LoginPage, RegisterPage
│   │   ├── store/           # authStore (Zustand)
│   │   └── types/           # TypeScript interfaces
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

---

### Option A — Local Development

#### 1. Clone the repo
```bash
git clone https://github.com/yourusername/smart-leads-dashboard.git
cd smart-leads-dashboard
```

#### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

#### 3. Seed the database (optional but recommended)
```bash
npm run seed
# Creates: admin@smartleads.com / admin123
#          sales@smartleads.com  / sales123
```

#### 4. Frontend setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

App runs at: http://localhost:5173

---

### Option B — Docker Compose

```bash
# From project root
docker-compose up --build

# Seed data (first time)
docker exec smart-leads-backend node dist/utils/seed.js
```

App runs at: http://localhost (port 80)

---

## Environment Variables

### Backend `.env`
| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry duration |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS |

---

## API Documentation

**Base URL:** `http://localhost:5000/api/v1`

All protected routes require: `Authorization: Bearer <token>`

---

### Auth

#### POST `/auth/register`
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
    "user": { "id": "...", "name": "Rahul Sharma", "email": "...", "role": "sales" }
  }
}
```

---

#### POST `/auth/login`
Login with credentials.

**Body:**
```json
{ "email": "admin@smartleads.com", "password": "admin123" }
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "token": "eyJhbGciOi...", "user": { ... } }
}
```

---

#### GET `/auth/me` 🔒
Get current user profile.

---

### Leads

#### GET `/leads` 🔒
Get paginated leads with optional filters.

**Query Params:**

| Param | Type | Values | Default |
|---|---|---|---|
| `page` | number | — | `1` |
| `limit` | number | — | `10` |
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` | — |
| `source` | string | `Website`, `Instagram`, `Referral` | — |
| `search` | string | — | — |
| `sort` | string | `latest`, `oldest` | `latest` |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1`

**Response `200`:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "name": "Rahul Sharma", ... } ],
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

#### GET `/leads/stats` 🔒
Get lead counts grouped by status and source.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 42,
    "byStatus": { "New": 12, "Contacted": 8, "Qualified": 15, "Lost": 7 },
    "bySource": { "Website": 20, "Instagram": 12, "Referral": 10 }
  }
}
```

---

#### GET `/leads/export` 🔒
Export leads as CSV. Accepts same filter params as `GET /leads`.

Returns `text/csv` file download.

---

#### GET `/leads/:id` 🔒
Get a single lead by ID.

---

#### POST `/leads` 🔒
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

---

#### PATCH `/leads/:id` 🔒
Update a lead (partial update). Same body fields as POST (all optional).

---

#### DELETE `/leads/:id` 🔒
Delete a lead. Sales users can only delete their own leads.

---

### Users (Admin only)

#### GET `/users` 🔒 Admin
List all users.

#### PATCH `/users/:id/role` 🔒 Admin
Update a user's role.

**Body:** `{ "role": "admin" }`

---

## Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@smartleads.com | admin123 |
| Sales | sales@smartleads.com | sales123 |

---

## Git Commit Convention

This project follows conventional commits:
- `feat:` — New features
- `fix:` — Bug fixes
- `chore:` — Build/config changes
- `refactor:` — Code refactoring
- `docs:` — Documentation updates

---

## Deployment

**Frontend:** Deploy `/frontend` to Vercel or Netlify  
**Backend:** Deploy `/backend` to Railway, Render, or any Node host  
**Database:** MongoDB Atlas (free tier)

Set the appropriate environment variables on each platform.

---

## License

MIT
