/**
 * Swagger API Documentation Configuration
 * 
 * This file defines the OpenAPI 3.0 specification for the Job Portal API.
 * When integrated with swagger-ui-express, it provides interactive API docs.
 * 
 * To install: npm install swagger-jsdoc swagger-ui-express
 * Then mount in app.js: app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
 */

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Job Portal / Recruitment Platform API',
    version: '1.0.0',
    description: `A production-ready REST API for a Job Portal / Recruitment Platform supporting three user roles: Administrator, Recruiter, and Job Seeker.

## Key Features
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (Admin, Recruiter, Job Seeker)
- Company & Job Management
- Application Tracking (Shortlist, Reject, Hire)
- Resume Upload with Multer
- Search & Filter Jobs
- Saved Jobs & Notifications
- Admin Dashboard & Reports`,
    contact: {
      name: 'Job Portal Team',
      email: 'support@jobportal.com',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'https://api.jobportal.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token. You get this from POST /auth/login or POST /auth/register',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', description: 'Unique user ID' },
          firstName: { type: 'string', description: 'First name' },
          lastName: { type: 'string', description: 'Last name' },
          email: { type: 'string', format: 'email', description: 'Email address' },
          role: { type: 'string', enum: ['admin', 'recruiter', 'jobseeker'], description: 'User role' },
          phone: { type: 'string', description: 'Phone number' },
          avatar: { type: 'string', description: 'Avatar URL' },
          isActive: { type: 'boolean', description: 'Account status' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Company: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', description: 'Company name' },
          description: { type: 'string', description: 'Company description' },
          industry: { type: 'string', description: 'Industry type' },
          website: { type: 'string', description: 'Company website' },
          email: { type: 'string', format: 'email', description: 'Company contact email' },
          phone: { type: 'string', description: 'Company phone' },
          size: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], description: 'Company size' },
          foundedYear: { type: 'number', description: 'Year founded' },
          socialLinks: {
            type: 'object',
            properties: {
              linkedin: { type: 'string' },
              twitter: { type: 'string' },
              facebook: { type: 'string' },
            },
          },
          isVerified: { type: 'boolean' },
        },
      },
      Job: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string', description: 'Job title' },
          description: { type: 'string', description: 'Job description' },
          location: { type: 'string', description: 'Job location' },
          employmentType: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'], description: 'Employment type' },
          workType: { type: 'string', enum: ['remote', 'onsite', 'hybrid'], description: 'Work type' },
          experienceLevel: { type: 'string', enum: ['entry', 'mid', 'senior', 'lead', 'executive'], description: 'Experience level' },
          salaryMin: { type: 'number', description: 'Minimum salary' },
          salaryMax: { type: 'number', description: 'Maximum salary' },
          currency: { type: 'string', default: 'USD' },
          skills: { type: 'array', items: { type: 'string' }, description: 'Required skills' },
          benefits: { type: 'array', items: { type: 'string' }, description: 'Benefits offered' },
          status: { type: 'string', enum: ['open', 'closed', 'draft'], description: 'Job status' },
          applicationCount: { type: 'number', default: 0, description: 'Number of applications' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired', 'withdrawn'], description: 'Application status' },
          notes: { type: 'string', description: 'Recruiter notes' },
          coverLetter: { type: 'string', description: 'Cover letter' },
          resumeUrl: { type: 'string', description: 'Resume file URL' },
        },
      },
      SavedJob: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          notes: { type: 'string', description: 'Personal notes about this job' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          message: { type: 'string', description: 'Error message' },
          errors: { type: 'array', items: { type: 'string' }, description: 'Validation errors array' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Create a new user account with specified role',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password', 'role'],
                properties: {
                  firstName: { type: 'string', example: 'John' },
                  lastName: { type: 'string', example: 'Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'SecurePass123!' },
                  role: { type: 'string', enum: ['recruiter', 'jobseeker'], example: 'jobseeker' },
                  phone: { type: 'string', example: '+1234567890' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Registration successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          '400': { description: 'Validation error / Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        description: 'Authenticate user with email and password',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', format: 'password', example: 'SecurePass123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful, returns tokens and user data' },
          '401': { description: 'Invalid email or password' },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token',
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string', description: 'Refresh token (or send as cookie)' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Token refreshed successfully' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        description: 'Clear refresh token and cookies',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logout successful' },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get user profile',
        description: 'Get the currently authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Profile retrieved successfully' },
          '401': { description: 'Not authorized' },
        },
      },
      put: {
        tags: ['Authentication'],
        summary: 'Update user profile',
        description: 'Update firstName, lastName, phone, or avatar',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  phone: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profile updated' },
        },
      },
    },
    '/auth/change-password': {
      put: {
        tags: ['Authentication'],
        summary: 'Change password',
        description: 'Change current password (requires current password)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', format: 'password' },
                  newPassword: { type: 'string', format: 'password', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password changed' },
          '400': { description: 'Current password is incorrect' },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Forgot password',
        description: 'Request a password reset token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Reset token sent' },
          '404': { description: 'Email not found' },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password',
        description: 'Reset password using reset token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                  token: { type: 'string', description: 'Reset token from email' },
                  password: { type: 'string', format: 'password', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset successful' },
          '400': { description: 'Invalid or expired token' },
        },
      },
    },
    '/companies': {
      get: {
        tags: ['Companies'],
        summary: 'Get all companies',
        description: 'List all verified companies with pagination',
        security: [],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'industry', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'List of companies' } },
      },
      post: {
        tags: ['Companies'],
        summary: 'Create company',
        description: 'Create a new company profile (Recruiter only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'industry'],
                properties: {
                  name: { type: 'string', example: 'Tech Corp' },
                  description: { type: 'string', example: 'A leading tech company' },
                  industry: { type: 'string', example: 'Technology' },
                  website: { type: 'string', example: 'https://techcorp.com' },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string' },
                  size: { type: 'string', enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] },
                  foundedYear: { type: 'number' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Company created' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/companies/me': {
      get: {
        tags: ['Companies'],
        summary: 'Get my company',
        description: 'Get the company associated with the authenticated recruiter',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Company data' },
          '404': { description: 'No company found' },
        },
      },
    },
    '/companies/search': {
      get: {
        tags: ['Companies'],
        summary: 'Search companies',
        description: 'Search companies by name, industry, or location',
        security: [],
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
        ],
        responses: { '200': { description: 'Search results' } },
      },
    },
    '/companies/{id}': {
      get: {
        tags: ['Companies'],
        summary: 'Get company by ID',
        security: [],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Company data' }, '404': { description: 'Not found' } },
      },
      put: {
        tags: ['Companies'],
        summary: 'Update company',
        description: 'Update company details (Recruiter owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Company updated' } },
      },
      delete: {
        tags: ['Companies'],
        summary: 'Delete company',
        description: 'Delete company profile (Recruiter owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Company deleted' } },
      },
    },
    '/jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'Search & filter jobs',
        description: 'Search jobs with filters: title, location, type, salary, etc.',
        security: [],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'location', in: 'query', schema: { type: 'string' } },
          { name: 'employmentType', in: 'query', schema: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'] } },
          { name: 'workType', in: 'query', schema: { type: 'string', enum: ['remote', 'onsite', 'hybrid'] } },
          { name: 'experienceLevel', in: 'query', schema: { type: 'string', enum: ['entry', 'mid', 'senior', 'lead', 'executive'] } },
          { name: 'salaryMin', in: 'query', schema: { type: 'number' } },
          { name: 'salaryMax', in: 'query', schema: { type: 'number' } },
          { name: 'status', in: 'query', schema: { type: 'string', default: 'open' } },
          { name: 'company', in: 'query', schema: { type: 'string' } },
          { name: 'skills', in: 'query', schema: { type: 'string' }, description: 'Comma-separated skills' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'sort', in: 'query', schema: { type: 'string', default: '-createdAt' } },
        ],
        responses: { '200': { description: 'Paginated job list with stats' } },
      },
      post: {
        tags: ['Jobs'],
        summary: 'Create job',
        description: 'Create a new job posting (Recruiter only - requires company)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'location', 'employmentType'],
                properties: {
                  title: { type: 'string', example: 'Senior Software Engineer' },
                  description: { type: 'string', example: 'We are looking for...' },
                  location: { type: 'string', example: 'San Francisco, CA' },
                  employmentType: { type: 'string', enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'] },
                  workType: { type: 'string', enum: ['remote', 'onsite', 'hybrid'] },
                  experienceLevel: { type: 'string', enum: ['entry', 'mid', 'senior', 'lead', 'executive'] },
                  salaryMin: { type: 'number' },
                  salaryMax: { type: 'number' },
                  currency: { type: 'string', default: 'USD' },
                  skills: { type: 'array', items: { type: 'string' } },
                  benefits: { type: 'array', items: { type: 'string' } },
                  requirements: { type: 'string' },
                  responsibilities: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Job created' } },
      },
    },
    '/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: 'Get job by ID',
        security: [],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job details' } },
      },
      put: {
        tags: ['Jobs'],
        summary: 'Update job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job updated' } },
      },
      delete: {
        tags: ['Jobs'],
        summary: 'Delete job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job deleted' } },
      },
    },
    '/jobs/{id}/close': {
      put: {
        tags: ['Jobs'],
        summary: 'Close job',
        description: 'Mark job as closed (no longer accepting applications)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job closed' } },
      },
    },
    '/jobs/recruiter/mine': {
      get: {
        tags: ['Jobs'],
        summary: 'Get recruiter jobs',
        description: 'Get all jobs posted by the authenticated recruiter',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of recruiter jobs' } },
      },
    },
    '/jobs/admin/all': {
      get: {
        tags: ['Jobs'],
        summary: 'Get all jobs (admin)',
        description: 'Admin: Get all jobs across all recruiters',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'All jobs' } },
      },
    },
    '/applications': {
      post: {
        tags: ['Applications'],
        summary: 'Apply for a job',
        description: 'Submit a job application (Job Seeker only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['job'],
                properties: {
                  job: { type: 'string', description: 'Job ID' },
                  coverLetter: { type: 'string' },
                  resume: { type: 'string', format: 'binary', description: 'Resume file (PDF/DOC/DOCX, max 5MB)' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Application submitted' },
          '400': { description: 'Already applied / Validation error' },
        },
      },
    },
    '/applications/mine': {
      get: {
        tags: ['Applications'],
        summary: 'Get my applications',
        description: 'Get all applications for the authenticated job seeker',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of user applications' } },
      },
    },
    '/applications/{id}': {
      get: {
        tags: ['Applications'],
        summary: 'Get application by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Application details' } },
      },
    },
    '/applications/{id}/withdraw': {
      put: {
        tags: ['Applications'],
        summary: 'Withdraw application',
        description: 'Withdraw a submitted application (Job Seeker only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Application withdrawn' } },
      },
    },
    '/applications/{id}/status': {
      put: {
        tags: ['Applications'],
        summary: 'Update application status (Recruiter)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['reviewing', 'shortlisted', 'rejected', 'hired'] },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Status updated' } },
      },
    },
    '/applications/{id}/shortlist': {
      put: {
        tags: ['Applications'],
        summary: 'Shortlist applicant',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Applicant shortlisted' } },
      },
    },
    '/applications/{id}/reject': {
      put: {
        tags: ['Applications'],
        summary: 'Reject applicant',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  notes: { type: 'string', description: 'Rejection reason' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Applicant rejected' } },
      },
    },
    '/applications/{id}/hire': {
      put: {
        tags: ['Applications'],
        summary: 'Hire applicant',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Applicant hired' } },
      },
    },
    '/jobs/{jobId}/applications': {
      get: {
        tags: ['Applications'],
        summary: 'Get job applications',
        description: 'Get all applications for a specific job (Recruiter only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'List of applications' } },
      },
    },
    '/saved-jobs': {
      get: {
        tags: ['Saved Jobs'],
        summary: 'Get saved jobs',
        description: 'Get all jobs saved by the authenticated job seeker',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of saved jobs' } },
      },
      post: {
        tags: ['Saved Jobs'],
        summary: 'Save a job',
        description: 'Save a job for later reference (Job Seeker only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['job'],
                properties: {
                  job: { type: 'string', description: 'Job ID' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Job saved' } },
      },
    },
    '/saved-jobs/check/{jobId}': {
      get: {
        tags: ['Saved Jobs'],
        summary: 'Check if job is saved',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'jobId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Save status' } },
      },
    },
    '/saved-jobs/{id}': {
      put: {
        tags: ['Saved Jobs'],
        summary: 'Update saved job notes',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Notes updated' } },
      },
      delete: {
        tags: ['Saved Jobs'],
        summary: 'Unsave a job',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job unsaved' } },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notifications',
        description: 'Get all notifications for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of notifications' } },
      },
    },
    '/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get unread count',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Unread count' } },
      },
    },
    '/notifications/{id}/read': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark as read',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Marked as read' } },
      },
    },
    '/notifications/read-all': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark all as read',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'All marked as read' } },
      },
    },
    '/notifications/{id}': {
      delete: {
        tags: ['Notifications'],
        summary: 'Delete notification',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Notification deleted' } },
      },
    },
    '/dashboard/recruiter': {
      get: {
        tags: ['Dashboard'],
        summary: 'Recruiter dashboard stats',
        description: 'Get dashboard statistics for recruiter',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Dashboard stats' } },
      },
    },
    '/dashboard/job-seeker': {
      get: {
        tags: ['Dashboard'],
        summary: 'Job Seeker dashboard stats',
        description: 'Get dashboard statistics for job seeker',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Dashboard stats' } },
      },
    },
    '/dashboard/admin': {
      get: {
        tags: ['Dashboard'],
        summary: 'Admin dashboard stats',
        description: 'Get dashboard statistics for admin',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Admin dashboard stats' } },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users (admin)',
        description: 'List all users with role and status filters',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'recruiter', 'jobseeker'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'User list' } },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user details (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'User details' } },
      },
      delete: {
        tags: ['Admin'],
        summary: 'Delete user (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'User deleted' } },
      },
    },
    '/admin/users/{id}/toggle-status': {
      put: {
        tags: ['Admin'],
        summary: 'Toggle user active status (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Status toggled' } },
      },
    },
    '/admin/users/{id}/role': {
      put: {
        tags: ['Admin'],
        summary: 'Update user role (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Role updated' } },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Admin dashboard (admin)',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Admin dashboard data' } },
      },
    },
    '/admin/reports': {
      get: {
        tags: ['Admin'],
        summary: 'Generate reports (admin)',
        description: 'Generate reports by date range and type',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['users', 'jobs', 'applications', 'companies'] } },
        ],
        responses: { '200': { description: 'Report data' } },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'API health check',
        security: [],
        responses: { '200': { description: 'API is healthy' } },
      },
    },
  },
};

module.exports = swaggerDefinition;


