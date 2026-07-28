const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const config = require('../../src/config');
const User = require('../../src/models/User');
const Company = require('../../src/models/Company');
const Job = require('../../src/models/Job');

describe('Job Routes', () => {
  let recruiterToken;
  let recruiterUser;
  let testCompany;
  let testJob;

  const jobPayload = {
    title: 'Senior Node.js Developer',
    description: 'We are hiring a Senior Node.js Engineer to build scalable APIs.',
    requirements: ['5+ years Node.js', 'MongoDB experience'],
    responsibilities: ['Architect microservices', 'Write unit tests'],
    location: 'Remote',
    workType: 'remote',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    salaryRange: { min: 90000, max: 120000, currency: 'USD' },
    skills: ['Node.js', 'Express', 'MongoDB'],
    positions: 2,
  };

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});

    // Create recruiter directly
    recruiterUser = await User.create({
      firstName: 'Recruiter',
      lastName: 'One',
      email: `recruiter_${Date.now()}_${Math.random()}@example.com`,
      password: 'Password123!',
      role: 'recruiter',
    });

    recruiterToken = jwt.sign(
      { id: recruiterUser._id, role: recruiterUser.role },
      config.jwt.secret,
      { expiresIn: '1d' }
    );

    // Create company for recruiter
    testCompany = await Company.create({
      userId: recruiterUser._id,
      companyName: 'TechCorp Solutions',
      industry: 'Technology',
      companySize: '51-200',
      description: 'Leading tech innovator.',
    });

    // Create an initial job
    testJob = await Job.create({
      ...jobPayload,
      companyId: testCompany._id,
      userId: recruiterUser._id,
    });
  });

  describe('GET /api/jobs', () => {
    it('should retrieve list of open jobs', async () => {
      const res = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('should filter jobs by search query', async () => {
      const res = await request(app)
        .get('/api/jobs?search=Node.js')
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('should retrieve job details by ID', async () => {
      const res = await request(app)
        .get(`/api/jobs/${testJob._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.job.title).toBe(jobPayload.title);
    });

    it('should return 404 for non-existent job ID', async () => {
      const res = await request(app)
        .get('/api/jobs/60f712345678901234567890')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/jobs', () => {
    it('should create a new job as a recruiter', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          ...jobPayload,
          title: 'Frontend React Engineer',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.job.title).toBe('Frontend React Engineer');
    });

    it('should not allow unauthenticated users to create job', async () => {
      const res = await request(app)
        .post('/api/jobs')
        .send(jobPayload)
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/jobs/:id/close', () => {
    it('should allow recruiter to close their job', async () => {
      const res = await request(app)
        .put(`/api/jobs/${testJob._id}/close`)
        .set('Authorization', `Bearer ${recruiterToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.job.status).toBe('closed');
    });
  });
});
