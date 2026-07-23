export const USER_ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  JOBSEEKER: 'jobseeker',
};

export const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  FILLED: 'filled',
  DRAFT: 'draft',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
  WITHDRAWN: 'withdrawn',
};

export const WORK_TYPES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead / Manager' },
  { value: 'executive', label: 'Executive' },
];

export const SALARY_RANGES = [
  { value: '0-30000', label: '$0 - $30,000' },
  { value: '30000-60000', label: '$30,000 - $60,000' },
  { value: '60000-90000', label: '$60,000 - $90,000' },
  { value: '90000-120000', label: '$90,000 - $120,000' },
  { value: '120000-150000', label: '$120,000 - $150,000' },
  { value: '150000+', label: '$150,000+' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50],
};

export const TOAST_DURATION = 3000;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};


