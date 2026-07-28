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

const isDbConnected = () => {
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  return mongoose.connection.readyState === 1;
};

module.exports = {
  MOCK_USER,
  MOCK_JOBS,
  MOCK_STATS,
  isDbConnected,
};
