# Job Portal - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├───────────────────────┬─────────────────────────────────────┤
│   Desktop Browser     │         Mobile Browser              │
│   (Chrome, Firefox)   │     (Responsive Design)             │
└───────────┬───────────┴──────────────────┬──────────────────┘
            │                              │
            └──────────────────┬───────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    CDN / Load Balancer                        │
│                      (Nginx / CloudFront)                    │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│   React SPA (Frontend)  │  │  API Gateway (Backend)  │
│   Port 3000             │  │  Port 5000              │
│   Nginx Static Server   │  │  Express.js Server      │
└─────────────────────────┘  └───────────┬─────────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────┐
                    │         Application Layer           │
                    ├────────────────────────────────────┤
                    │  Controllers → Services → Models   │
                    │  Middleware: Auth, Validation,      │
                    │  Error Handling, File Upload       │
                    └────────────────────────────────────┘
                                         │
                                         ▼
                    ┌────────────────────────────────────┐
                    │         Database Layer              │
                    ├────────────────────────────────────┤
                    │         MongoDB                     │
                    │  Collections: Users, Companies,     │
                    │  Jobs, Applications, SavedJobs,     │
                    │  Notifications                      │
                    └────────────────────────────────────┘
```

## MVC Architecture

```
src/
├── config/           # Configuration files
│   ├── index.js      # Environment variables
│   ├── database.js   # MongoDB connection
│   └── swagger.js    # API documentation
│
├── models/           # Database schemas (Mongoose)
│   ├── User.js
│   ├── Company.js
│   ├── Job.js
│   ├── Application.js
│   ├── SavedJob.js
│   └── Notification.js
│
├── routes/           # Route definitions
│   ├── auth.routes.js
│   ├── company.routes.js
│   ├── job.routes.js
│   ├── application.routes.js
│   └── ...
│
├── controllers/      # Request handlers
│   ├── auth.controller.js
│   ├── company.controller.js
│   └── ...
│
├── services/         # Business logic
│   ├── auth.service.js
│   ├── company.service.js
│   └── ...
│
├── middleware/        # Express middleware
│   ├── auth.js        # JWT & role verification
│   ├── errorHandler.js # Error handling
│   ├── validate.js    # Input validation
│   └── upload.js      # File upload (Multer)
│
├── validators/       # Request validation rules
│   └── *.validator.js
│
└── utils/            # Utility functions
    ├── ApiError.js
    ├── ApiResponse.js
    └── catchAsync.js
```

## Data Flow

### Authentication Flow
```
User → Login → Auth Controller → Auth Service → User Model → DB
     ← JWT Tokens ← Response ← Return tokens ← Validation
```

### Job Application Flow
```
Job Seeker → Apply → Controller → Check eligibility → Service → Create Application → DB
                                     ↓                  ↓
                               Notification sent   Email notification
```

### Recruiter Flow
```
Recruiter → Post Job → Controller → Validate → Service → Create Job → DB
     ← Dashboard ← Get stats ← Aggregate ← Applications ← Receive apps
```

## ER Diagram (Text-Based)

```
┌────────────────────────────┐
│          User              │
├────────────────────────────┤
│ _id: ObjectId (PK)         │
│ firstName: String          │
│ lastName: String           │
│ email: String (Unique)     │
│ password: String (Hashed)  │
│ role: enum                 │
│ phone: String              │
│ avatar: String             │
│ isActive: Boolean          │
│ refreshToken: String       │
│ passwordChangedAt: Date    │
│ passwordResetToken: String │
│ passwordResetExpires: Date │
│ createdAt: Date            │
│ updatedAt: Date            │
└───────────┬────────────────┘
            │ 1
            │
            │ has
            │
┌───────────▼────────────────┐      ┌────────────────────────────┐
│         Company            │      │           Job              │
├────────────────────────────┤      ├────────────────────────────┤
│ _id: ObjectId (PK)         │      │ _id: ObjectId (PK)         │
│ name: String               │──────│ company: ObjectId (FK)     │
│ description: String        │ 1:N  │ title: String              │
│ industry: String           │      │ description: String        │
│ website: String            │      │ location: String           │
│ email: String              │      │ employmentType: enum       │
│ phone: String              │      │ workType: enum             │
│ size: enum                 │      │ experienceLevel: enum      │
│ foundedYear: Number        │      │ salaryMin: Number          │
│ socialLinks: Object        │      │ salaryMax: Number          │
│ isVerified: Boolean        │      │ currency: String           │
│ userId: ObjectId (FK)      │      │ skills: [String]          │
│ createdAt: Date            │      │ benefits: [String]        │
│ updatedAt: Date            │      │ status: enum               │
└────────────────────────────┘      │ applicationCount: Number   │
                                    │ createdBy: ObjectId (FK)  │
        ┌───────────────────────────│ createdAt: Date            │
        │                           │ updatedAt: Date            │
        │ 1                         └──────────────┬─────────────┘
        │                                          │ 1
        │                                          │
        │ 1:N                                      │ 1:N
┌───────▼────────────────────┐   ┌─────────────────▼─────────────┐
│      SavedJob              │   │        Application             │
├────────────────────────────┤   ├───────────────────────────────┤
│ _id: ObjectId (PK)         │   │ _id: ObjectId (PK)            │
│ user: ObjectId (FK)        │   │ job: ObjectId (FK)            │
│ job: ObjectId (FK)         │   │ user: ObjectId (FK)           │
│ notes: String              │   │ company: ObjectId (FK)        │
│ savedAt: Date              │   │ status: enum                  │
│ createdAt: Date            │   │ coverLetter: String           │
│ updatedAt: Date            │   │ resumeUrl: String             │
└────────────────────────────┘   │ notes: String                 │
                                 │ appliedAt: Date               │
┌────────────────────────────┐   │ createdAt: Date               │
│      Notification          │   │ updatedAt: Date               │
├────────────────────────────┤   └───────────────────────────────┘
│ _id: ObjectId (PK)         │
│ user: ObjectId (FK)        │
│ type: String               │
│ title: String              │
│ message: String            │
│ isRead: Boolean            │
│ data: Object               │
│ createdAt: Date             │
│ updatedAt: Date             │
└────────────────────────────┘
```


