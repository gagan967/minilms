# Mini Learning Management System (Mini LMS)

A full-stack Learning Management System with JWT authentication and Role-Based Access Control (RBAC).

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Auth**: JWT, bcrypt for password hashing

## Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Admin** | View all users and courses, create courses and assignments |
| **Instructor** | Create courses, create assignments, view submissions |
| **Student** | Enroll in courses, submit assignments, view enrolled courses |

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### 1. Install dependencies

```bash
npm run setup
```

### 2. Configure environment

Copy the example env file and update values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/mini_lms
JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN=7d
```

### 3. Create database

```sql
CREATE DATABASE mini_lms;
```

### 4. Run migrations

```bash
npm run setup:db
```

### 5. Start development servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | /api/auth/signup | No | - | Register |
| POST | /api/auth/login | No | - | Login |
| GET | /api/auth/me | Yes | All | Current user |
| GET | /api/courses | Yes | All | List courses (paginated) |
| POST | /api/courses | Yes | Admin, Instructor | Create course |
| GET | /api/courses/:id | Yes | All | Course detail |
| POST | /api/courses/:id/enroll | Yes | Student | Enroll in course |
| POST | /api/assignments | Yes | Admin, Instructor | Create assignment |
| GET | /api/assignments/course/:courseId | Yes | All | List assignments |
| POST | /api/submissions | Yes | Student | Submit assignment |
| GET | /api/dashboard/student | Yes | Student | Student dashboard |
| GET | /api/dashboard/instructor | Yes | Instructor | Instructor dashboard |
| GET | /api/dashboard/admin | Yes | Admin | Admin dashboard |

## Deploy to Railway

### 1. Create Railway project

1. Go to [railway.app](https://railway.app) and create a project
2. Add a **PostgreSQL** plugin (Railway will provide `DATABASE_URL`)
3. Connect your GitHub repo

### 2. Configure environment variables

In Railway project settings, add:

- `DATABASE_URL` (auto-set by PostgreSQL plugin)
- `JWT_SECRET` (generate a strong random string)
- `NODE_ENV` = `production`

### 3. Build and deploy

- **Build Command**: `npm run build`
- **Start Command**: `cd server && npm run migrate && npm start` (run migrate once, or add a release phase)
- **Root Directory**: Leave as repo root

Or use the included `railway.json` and `Procfile`.

### 4. Run migrations

After first deploy, run migrations via Railway CLI or a one-off command:

```bash
railway run npm run setup:db
```

## Project Structure

```
lms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/        # Auth, Theme
│   │   └── pages/
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── middleware/     # auth, rbac, rate limit, activity log
│   │   ├── models/         # Sequelize models
│   │   └── routes/
│   └── ...
├── package.json
├── Procfile
├── railway.json
└── README.md
```

## Features

- JWT authentication with protected routes
- RBAC for Admin, Instructor, Student
- Course CRUD with pagination
- Assignment creation and text submissions
- Activity logs (userId, action, timestamp)
- Rate limiting on API
- Dark mode toggle
- Responsive UI with Tailwind CSS
