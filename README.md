# Mini Learning Management System (Mini LMS)

A full-stack Learning Management System with JWT authentication, Role-Based Access Control (RBAC), and a modern glassmorphism UI.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Auth**: JWT, bcrypt for password hashing
- **UI**: Glassmorphism design with dark mode support

## Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Admin** | View all users and courses, create/delete courses and assignments, manage everything |
| **Instructor** | Create/delete courses and assignments, view submissions, manage own courses |
| **Student** | Enroll in courses, submit assignments, view enrolled courses and submissions |

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL

### 1. Install dependencies

```bash
npm run setup
```

### 2. Configure Environment

Copy the example env file and update values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mini_lms
JWT_SECRET=your-secure-random-secret-here
JWT_EXPIRES_IN=7d
```

**Note**: Replace `yourpassword` with your PostgreSQL password. Default is often `postgres` or `password`.

### 3. Create database

```sql
CREATE DATABASE mini_lms;
```

### 4. Run migrations

```bash
npm run setup:db
```

### 5. (Optional) Seed Sample Data

To populate the database with sample users, courses, assignments, and submissions:

```bash
npm run seed
```

Sample accounts:
- **Admin**: admin@lms.com / admin123
- **Instructors**: instructor1@lms.com, instructor2@lms.com / pass123
- **Students**: student1@lms.com, student2@lms.com, student3@lms.com / pass123

### 6. Start development servers

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
| DELETE | /api/courses/:id | Yes | Admin, Instructor | Delete course (owner only) |
| GET | /api/courses/:id | Yes | All | Course details |
| POST | /api/courses/:id/enroll | Yes | Student | Enroll in course |
| POST | /api/assignments | Yes | Admin, Instructor | Create assignment |
| GET | /api/assignments/course/:courseId | Yes | All | List course assignments |
| DELETE | /api/assignments/:id | Yes | Admin, Instructor | Delete assignment (owner only) |
| POST | /api/submissions | Yes | Student | Submit assignment |
| GET | /api/dashboard/student | Yes | Student | Student dashboard |
| GET | /api/dashboard/instructor | Yes | Instructor | Instructor dashboard |
| GET | /api/dashboard/admin | Yes | Admin | Admin dashboard data |

## Manual Testing Checklist

After setup, test these features manually:

### Authentication
- Signup with different roles (Student, Instructor, Admin)
- Login/Logout functionality
- Protected routes (try accessing without login)

### Dashboards
- Student: Enrolled courses, submitted assignments
- Instructor: Created courses, manage assignments
- Admin: All users, all courses

### Course Management
- View courses (pagination)
- Create course (Instructor/Admin)
- Enroll (Student)
- Delete course (Owner/Admin)

### Assignment Management
- Create assignment (Instructor/Admin)
- Submit assignment (Student)
- View submissions (Instructor/Admin)
- Delete assignment (Owner/Admin)

### UI/UX
- Dark mode toggle
- Glassmorphism effects
- Responsiveness on mobile
- Form validation and errors

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

After deploy, run migrations:

```bash
railway run npm run setup:db
```

### 5. (Optional) Seed Sample Data

To add sample data:

```bash
railway run npm run seed
```

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and create PR

## License

MIT License

## Project Structure

```
mini-lms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Layout, ProtectedRoute
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/          # Dashboard, Courses, etc.
│   │   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── middleware/     # auth, rbac, rateLimiter, activityLog
│   │   ├── models/         # Sequelize models (User, Course, etc.)
│   │   ├── routes/         # API routes
│   │   └── db/             # Migrations, seeders
│   └── .env                # Environment config
├── package.json            # Root scripts
├── Procfile                # Heroku/Railway start
├── railway.json            # Railway config
└── README.md
```

## Features

### Core Functionality
- **Authentication**: Signup (with role selection), Login, Logout, JWT-based sessions, Protected routes
- **Dashboard**: Role-specific dashboards with relevant data and actions
- **Course Management**: Create, view (paginated), enroll, delete courses
- **Assignment Management**: Create, view, submit (text-only), delete assignments
- **User Management**: Admin view of all users
- **Activity Logs**: Automatic logging of user actions (stored in DB)
- **Rate Limiting**: API rate limiting to prevent abuse

### UI/UX Features
- **Glassmorphism Design**: Modern frosted glass effects on cards, forms, and navigation
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-friendly layout
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Indicators for async operations

### Additional Features
- **Pagination**: Courses list with page navigation
- **CRUD Operations**: Full create, read, update (via delete), delete for courses and assignments
- **Security**: Password hashing, RBAC middleware, CORS enabled
