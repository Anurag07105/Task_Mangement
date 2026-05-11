# Team Task Manager (Full-Stack)

Production-ready Team Task Manager web application with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose
- JWT auth + role-based access (Admin/Member)
- Recharts dashboard analytics
- Railway-ready backend deployment setup

## Folder Structure

```text
Team Task Manager/
├─ client/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ layout/
│  │  ├─ pages/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ .env.example
│  ├─ package.json
│  ├─ tailwind.config.js
│  ├─ postcss.config.js
│  └─ vite.config.js
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ constants/
│  │  ├─ controllers/
│  │  ├─ middlewares/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  ├─ validators/
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ railway.json
├─ package.json
└─ README.md
```

## Backend Features

- **Authentication**: Signup/Login with JWT token generation.
- **Password Security**: `bcryptjs` hashing with model hook.
- **Role Permissions**:
  - Admin: can create projects/tasks, manage members, view all tasks, and change statuses.
  - Member: can view accessible projects, update project status (for joined projects), and update task status in joined projects.
- **Project Management**:
  - Create project
  - Update project status (`planning`, `active`, `completed`)
  - Add/remove members
  - View project details
- **Task Management**:
  - Create task
  - Assign to member
  - Status update (`todo`, `in_progress`, `done`)
  - Priority (`low`, `medium`, `high`)
  - Due date support
  - Search/filter support
- **Dashboard APIs**:
  - Total, completed, pending, overdue task stats
  - Progress chart data
- **Architecture**:
  - MVC structure
  - Validation with `express-validator`
  - Centralized error handling middleware
  - Async controller error propagation

## Frontend Features

- Responsive premium dark UI with Tailwind
- Sidebar navigation
- Auth pages (Signup/Login)
- Protected routes
- Dashboard cards + Recharts pie chart
- Projects page with member management
- Tasks page with:
  - create task (admin)
  - filter/search
  - status update
- Toast notifications (`react-hot-toast`)
- Loading states
- Axios auth interceptor

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation & Local Run

From project root:

```bash
npm run install:all
```

Run backend:

```bash
npm run dev:server
```

Run frontend:

```bash
npm run dev:client
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## REST API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users` (admin only)

### Projects
- `GET /api/projects`
- `POST /api/projects` (admin only)
- `GET /api/projects/:id`
- `POST /api/projects/:id/members` (admin only)
- `DELETE /api/projects/:id/members/:memberId` (admin only)
- `PATCH /api/projects/:id/status` (admin + project members)

### Tasks
- `GET /api/tasks?search=&status=&priority=&projectId=&assignedTo=`
- `GET /api/tasks/dashboard`
- `POST /api/tasks` (admin only)
- `PATCH /api/tasks/:id`

## Railway Deployment (Backend)

`railway.json` is already included and configured to run:

```bash
npm run start --prefix server
```

### Steps
1. Push repository to GitHub.
2. Create new Railway project from GitHub repo.
3. Set environment variables from `server/.env.example`.
4. Deploy.
5. Copy Railway backend URL and set frontend env:
   - `VITE_API_URL=https://<your-railway-domain>/api`

## Frontend Deployment

Deploy `client` to Vercel/Netlify (or Railway static hosting):
1. Build command: `npm run build --prefix client`
2. Publish directory: `client/dist`
3. Add env var `VITE_API_URL` to deployed backend URL.

## CI/CD Pipeline (GitHub Actions)

Workflow file: `.github/workflows/ci-cd.yml`

### What it does
- Runs CI on pull requests and pushes to `main`
- Installs backend and frontend dependencies
- Builds frontend and checks backend syntax
- Auto-deploys backend to Railway on `main` (if Railway secrets are set)
- Auto-deploys frontend to Vercel on `main` (if Vercel secrets are set)

### Required GitHub Secrets

For Railway backend deployment:
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_SERVICE_ID`

For Vercel frontend deployment:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Production Notes

- Enforce strong `JWT_SECRET` in production.
- Configure CORS `CLIENT_URL` for deployed frontend domain.
- Consider adding rate limiting and refresh token strategy for enterprise-grade security.
- Add tests (unit/integration/e2e) before launch.
