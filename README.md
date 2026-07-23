# 🏢 Job Portal / Recruitment Platform

A **Production-Ready** full-stack Job Portal / Recruitment Platform built with the MERN stack (MongoDB, Express, React, Node.js). This platform serves **three user roles**: Administrator, Recruiter, and Job Seeker.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap / Tailwind CSS** - Styling
- **JavaScript (ES6+)** - Language

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose ODM** - MongoDB object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control

### Tools
- **Postman** - API testing
- **MongoDB Compass** - Database GUI
- **VS Code** - IDE

---

## 🏗️ Architecture

The application follows the **Model-View-Controller (MVC)** architecture pattern with a service layer for business logic.

```
Client (React) → API Gateway → Controllers → Services → Models → MongoDB
                                ├── Middleware (Auth, Validation, Error Handling)
                                ├── Utils (Helpers, API Response)
                                └── Validators (Input Validation)
```

---

## ✨ Features

### 👑 Administrator
- Manage users (view, activate/deactivate, delete)
- Manage recruiters and job seekers
- Manage all jobs
- Dashboard with analytics
- Reports generation

### 👔 Recruiter
- Register and login
- Company profile management (create, edit, delete)
- Job management (create, update, delete, close)
- View applicants for each job
- Manage applications (shortlist, reject, hire)
- Download applicant resumes
- Dashboard

### 👤 Job Seeker
- Register and login
- Profile management
- Resume upload (PDF/DOC/DOCX, max 5MB)
- Search and filter jobs
- Apply for jobs
- Save jobs for later
- Withdraw applications
- Track application status
- Dashboard

### 🔒 Security
- JWT with refresh tokens
- Role-based access control
- Password hashing with bcrypt
- Helmet security headers
- CORS configuration
- Rate limiting
- Input validation & sanitization
- Environment variables

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** (v9 or later)
- **MongoDB** (v7 or later) - local or Atlas
- **Git**
- **Docker** & **Docker Compose** (optional, for containerized setup)

### Local Development Setup

#### 1. Clone the repository

```bash
git clone <repository-url>
cd job-portal
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_change_in_production
JWT_REFRESH_EXPIRE=7d
COOKIE_SECRET=your_cookie_secret_change_in_production
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

#### 4. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

The API will be running at `http://localhost:5000` and the frontend at `http://localhost:3000`.

### Docker Setup

Run the entire application stack with a single command:

```bash
docker-compose up -d
```

This will start:
- **MongoDB** on port `27017`
- **Backend API** on port `5000`
- **Frontend** on port `3000`

To stop the containers:
```bash
docker-compose down
```

---

## 📁 Project Structure

```
job-portal/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── index.js       # App configuration
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/       # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── company.controller.js
│   │   │   ├── job.controller.js
│   │   │   ├── application.controller.js
│   │   │   └── savedJob.controller.js
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js        # JWT auth & role middleware
│   │   │   ├── errorHandler.js
│   │   │   ├── validate.js
│   │   │   ├── upload.js      # Multer configuration
│   │   │   ├── pagination.js
│   │   │   └── companyAccess.js
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Company.js
│   │   │   ├── Job.js
│   │   │   ├── Application.js
│   │   │   ├── SavedJob.js
│   │   │   └── index.js
│   │   ├── routes/            # Express routes
│   │   │   ├── index.js       # Route aggregator
│   │   │   ├── auth.routes.js
│   │   │   ├── company.routes.js
│   │   │   ├── job.routes.js
│   │   │   ├── application.routes.js
│   │   │   ├── savedJob.routes.js
│   │   │   └── admin.routes.js
│   │   ├── services/          # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── company.service.js
│   │   │   ├── job.service.js
│   │   │   ├── application.service.js
│   │   │   └── savedJob.service.js
│   │   ├── utils/             # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── catchAsync.js
│   │   │   └── helpers.js
│   │   ├── validators/        # Input validation
│   │   │   ├── auth.validator.js
│   │   │   ├── company.validator.js
│   │   │   ├── job.validator.js
│   │   │   └── application.validator.js
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── uploads/               # File upload directory
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/                  # React frontend
├── docker-compose.yml         # Docker Compose config
├── .gitignore
└── README.md
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                    | Description          | Auth     | Role       |
|--------|-----------------------------|----------------------|----------|------------|
| POST   | `/api/auth/register`        | Register user        | Public   | Any        |
| POST   | `/api/auth/login`           | Login user           | Public   | Any        |
| POST   | `/api/auth/refresh-token`   | Refresh JWT token    | Public   | Any        |
| POST   | `/api/auth/forgot-password` | Request password reset| Public  | Any        |
| POST   | `/api/auth/reset-password`  | Reset password       | Public   | Any        |
| GET    | `/api/auth/profile`         | Get user profile     | Private  | Any        |
| PUT    | `/api/auth/profile`         | Update profile       | Private  | Any        |
| PUT    | `/api/auth/change-password` | Change password      | Private  | Any        |
| POST   | `/api/auth/logout`          | Logout user          | Private  | Any        |

### Company Endpoints

| Method | Endpoint                          | Description            | Auth     | Role        |
|--------|-----------------------------------|------------------------|----------|-------------|
| GET    | `/api/companies`                  | Get all companies      | Public   | Any         |
| GET    | `/api/companies/search`           | Search companies       | Public   | Any         |
| GET    | `/api/companies/:id`              | Get company by ID      | Public   | Any         |
| POST   | `/api/companies`                  | Create company         | Private  | Recruiter   |
| GET    | `/api/companies/me`               | Get my company         | Private  | Recruiter   |
| PUT    | `/api/companies/:id`              | Update company         | Private  | Recruiter   |
| DELETE | `/api/companies/:id`              | Delete company         | Private  | Recruiter   |

### Job Endpoints

| Method | Endpoint                          | Description            | Auth     | Role        |
|--------|-----------------------------------|------------------------|----------|-------------|
| GET    | `/api/jobs`                       | Search & filter jobs   | Public   | Any         |
| GET    | `/api/jobs/:id`                   | Get job by ID          | Public   | Any         |
| POST   | `/api/jobs`                       | Create job             | Private  | Recruiter   |
| GET    | `/api/jobs/recruiter/mine`        | Get recruiter's jobs   | Private  | Recruiter   |
| PUT    | `/api/jobs/:id`                   | Update job             | Private  | Recruiter   |
| DELETE | `/api/jobs/:id`                   | Delete job             | Private  | Recruiter   |
| PUT    | `/api/jobs/:id/close`             | Close job              | Private  | Recruiter   |
| GET    | `/api/jobs/admin/all`             | Get all jobs (admin)   | Private  | Admin       |

### Application Endpoints

| Method | Endpoint                              | Description              | Auth     | Role        |
|--------|---------------------------------------|--------------------------|----------|-------------|
| POST   | `/api/applications`                   | Apply for job            | Private  | JobSeeker   |
| GET    | `/api/applications/mine`              | Get user's applications  | Private  | JobSeeker   |
| PUT    | `/api/applications/:id/withdraw`      | Withdraw application     | Private  | JobSeeker   |
| GET    | `/api/applications/:id`               | Get application details  | Private  | Owner/Rec   |
| PUT    | `/api/applications/:id/status`        | Update status            | Private  | Recruiter   |
| PUT    | `/api/applications/:id/shortlist`     | Shortlist applicant      | Private  | Recruiter   |
| PUT    | `/api/applications/:id/reject`        | Reject applicant         | Private  | Recruiter   |
| PUT    | `/api/applications/:id/hire`          | Hire applicant           | Private  | Recruiter   |
| GET    | `/api/applications/admin/all`         | All applications (admin) | Private  | Admin       |

### Saved Job Endpoints

| Method | Endpoint                         | Description             | Auth     | Role        |
|--------|----------------------------------|-------------------------|----------|-------------|
| POST   | `/api/saved-jobs`                | Save a job              | Private  | JobSeeker   |
| GET    | `/api/saved-jobs`                | Get saved jobs          | Private  | JobSeeker   |
| GET    | `/api/saved-jobs/check/:jobId`   | Check if job is saved   | Private  | JobSeeker   |
| PUT    | `/api/saved-jobs/:id`            | Update saved job notes  | Private  | JobSeeker   |
| DELETE | `/api/saved-jobs/:id`            | Unsave a job            | Private  | JobSeeker   |

### Admin Endpoints

| Method | Endpoint                                    | Description              | Auth     | Role   |
|--------|---------------------------------------------|--------------------------|----------|--------|
| GET    | `/api/admin/dashboard`                      | Dashboard analytics       | Private  | Admin  |
| GET    | `/api/admin/users`                          | Manage users              | Private  | Admin  |
| GET    | `/api/admin/users/:id`                      | Get user details          | Private  | Admin  |
| PUT    | `/api/admin/users/:id/toggle-status`        | Activate/deactivate user  | Private  | Admin  |
| PUT    | `/api/admin/users/:id/role`                 | Update user role          | Private  | Admin  |
| DELETE | `/api/admin/users/:id`                      | Delete user               | Private  | Admin  |
| GET    | `/api/admin/reports`                        | Generate reports          | Private  | Admin  |

### Health Check
- **GET** `/api/health` - API health status

### Response Format

All API responses follow a consistent JSON structure:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Validation errors (optional)
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User logs in with email/password
2. Server validates credentials, returns **Access Token** (15min expiry) and **Refresh Token** (7 day expiry)
3. Access Token is sent as `Authorization: Bearer <token>` header
4. When Access Token expires, client uses Refresh Token to get a new one via `POST /api/auth/refresh-token`
5. Both tokens are also set as HTTP-only cookies for additional security

### Role-Based Access Control

Three roles are supported:
- **`admin`** - Full system access
- **`recruiter`** - Company and job management
- **`jobseeker`** - Job search and applications

Middleware enforces access:
```javascript
// Protect route (any authenticated user)
protect

// Role-specific access
isAdmin()
isRecruiter()
isJobSeeker()
```

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test
```

---

## 🚢 Deployment

### Production Build

```bash
# Build and start with Docker
docker-compose -f docker-compose.yml up -d --build
```

### Environment Variables for Production

Ensure all sensitive environment variables are set in your deployment environment:
- `JWT_SECRET` - Strong random string
- `JWT_REFRESH_SECRET` - Strong random string
- `COOKIE_SECRET` - Strong random string
- `MONGODB_URI` - Production MongoDB connection string

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Job Portal Team**

---

## 🙏 Acknowledgments

- Express.js team for the amazing web framework
- MongoDB team for the powerful database
- React team for the frontend library
- All open-source contributors whose packages made this project possible

