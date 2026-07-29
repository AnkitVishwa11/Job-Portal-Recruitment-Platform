const mongoose = require('mongoose');

const MOCK_USER = {
  _id: '60c72b2f9b1d8b2bad000001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'candidate@example.com',
  role: 'jobseeker',
  isActive: true,
  createdAt: new Date().toISOString(),
};

const MOCK_JOBS = [
  {
    _id: '60c72b2f9b1d8b2bad000002',
    title: 'Senior Frontend Developer (React)',
    companyId: {
      _id: '60c72b2f9b1d8b2bad000003',
      companyName: 'TechCorp Global',
      logo: '',
      location: 'San Francisco, CA',
      industry: 'Software Engineering',
    },
    company: {
      name: 'TechCorp Global',
    },
    location: 'San Francisco, CA (Hybrid)',
    workType: 'hybrid',
    employmentType: 'full-time',
    experienceLevel: 'senior',
    salaryRange: { min: 120000, max: 150000 },
    salaryMin: 120000,
    salaryMax: 150000,
    skills: 'React, Redux, JavaScript, Bootstrap',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    isActive: true,
  },
  {
    _id: '60c72b2f9b1d8b2bad000004',
    title: 'Software Engineer (Node.js/Express)',
    companyId: {
      _id: '60c72b2f9b1d8b2bad000005',
      companyName: 'CloudScale Inc',
      logo: '',
      location: 'Remote',
      industry: 'Cloud Services',
    },
    company: {
      name: 'CloudScale Inc',
    },
    location: 'Remote',
    workType: 'remote',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryRange: { min: 90000, max: 120000 },
    salaryMin: 90000,
    salaryMax: 120000,
    skills: 'Node.js, Express, MongoDB, REST API',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    isActive: true,
  },
  {
    _id: '60c72b2f9b1d8b2bad000006',
    title: 'Product Designer (UI/UX)',
    companyId: {
      _id: '60c72b2f9b1d8b2bad000007',
      companyName: 'InvisionStudio',
      logo: '',
      location: 'New York, NY',
      industry: 'Design',
    },
    company: {
      name: 'InvisionStudio',
    },
    location: 'New York, NY (On-site)',
    workType: 'onsite',
    employmentType: 'full-time',
    experienceLevel: 'mid',
    salaryRange: { min: 85000, max: 110000 },
    salaryMin: 85000,
    salaryMax: 110000,
    skills: 'Figma, UI/UX, Design Systems, Prototyping',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    isActive: true,
  },
];

const MOCK_STATS = {
  activeJobs: 12,
  companies: 5,
  jobSeekers: 150,
  hired: 45,
};

const MOCK_APPLICATIONS = [
  {
    _id: '60c72b2f9b1d8b2bad000010',
    jobId: MOCK_JOBS[0],
    job: { title: MOCK_JOBS[0].title, _id: MOCK_JOBS[0]._id, location: MOCK_JOBS[0].location },
    userId: MOCK_USER._id,
    companyId: MOCK_JOBS[0].companyId,
    company: { name: MOCK_JOBS[0].companyId.companyName },
    resume: 'mock_resume.pdf',
    coverLetter: 'I am very interested in this role.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '60c72b2f9b1d8b2bad000011',
    jobId: MOCK_JOBS[1],
    job: { title: MOCK_JOBS[1].title, _id: MOCK_JOBS[1]._id, location: MOCK_JOBS[1].location },
    userId: MOCK_USER._id,
    companyId: MOCK_JOBS[1].companyId,
    company: { name: MOCK_JOBS[1].companyId.companyName },
    resume: 'mock_resume.pdf',
    coverLetter: 'Looking forward to discussing my backend experience.',
    status: 'shortlisted',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_COMPANIES = [
  MOCK_JOBS[0].companyId,
  MOCK_JOBS[1].companyId,
  MOCK_JOBS[2].companyId,
];

const MOCK_SAVED_JOBS = [
  {
    _id: '60c72b2f9b1d8b2bad000020',
    jobId: MOCK_JOBS[0],
    job: MOCK_JOBS[0],
    userId: MOCK_USER._id,
    notes: 'Applied on Monday',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_NOTIFICATIONS = [
  {
    _id: '60c72b2f9b1d8b2bad000030',
    userId: MOCK_USER._id,
    title: 'Application Shortlisted',
    message: 'Your application for Software Engineer (Node.js/Express) was shortlisted!',
    type: 'application_status',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  MOCK_USER,
  MOCK_JOBS,
  MOCK_STATS,
  MOCK_APPLICATIONS,
  MOCK_COMPANIES,
  MOCK_SAVED_JOBS,
  MOCK_NOTIFICATIONS,
  isDbConnected,
};

