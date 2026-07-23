import axiosInstance from './axios';

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  refreshToken: (data) => axiosInstance.post('/auth/refresh-token', data),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.put('/auth/change-password', data),
  logout: () => axiosInstance.post('/auth/logout'),
};

export const companyApi = {
  getAll: (params) => axiosInstance.get('/companies', { params }),
  search: (params) => axiosInstance.get('/companies/search', { params }),
  getById: (id) => axiosInstance.get(`/companies/${id}`),
  getMyCompany: () => axiosInstance.get('/companies/me'),
  create: (data) => axiosInstance.post('/companies', data),
  update: (id, data) => axiosInstance.put(`/companies/${id}`, data),
  delete: (id) => axiosInstance.delete(`/companies/${id}`),
};

export const jobApi = {
  search: (params) => axiosInstance.get('/jobs', { params }),
  getById: (id) => axiosInstance.get(`/jobs/${id}`),
  create: (data) => axiosInstance.post('/jobs', data),
  update: (id, data) => axiosInstance.put(`/jobs/${id}`, data),
  delete: (id) => axiosInstance.delete(`/jobs/${id}`),
  close: (id) => axiosInstance.put(`/jobs/${id}/close`),
  getRecruiterJobs: (params) => axiosInstance.get('/jobs/recruiter/mine', { params }),
  getAllJobs: (params) => axiosInstance.get('/jobs/admin/all', { params }),
};

export const applicationApi = {
  apply: (data) =>
    axiosInstance.post('/applications', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (id) => axiosInstance.get(`/applications/${id}`),
  downloadResume: (id) =>
    axiosInstance.get(`/applications/${id}/resume`, { responseType: 'blob' }),
  getJobApplications: (jobId, params) =>
    axiosInstance.get(`/jobs/${jobId}/applications`, { params }),
  getUserApplications: (params) =>
    axiosInstance.get('/applications/mine', { params }),
  updateStatus: (id, data) =>
    axiosInstance.put(`/applications/${id}/status`, data),
  shortlist: (id) => axiosInstance.put(`/applications/${id}/shortlist`),
  reject: (id, data) => axiosInstance.put(`/applications/${id}/reject`, data),
  hire: (id) => axiosInstance.put(`/applications/${id}/hire`),
  withdraw: (id) => axiosInstance.put(`/applications/${id}/withdraw`),
  getAllApplications: (params) =>
    axiosInstance.get('/applications/admin/all', { params }),
};

export const savedJobApi = {
  save: (data) => axiosInstance.post('/saved-jobs', data),
  getAll: (params) => axiosInstance.get('/saved-jobs', { params }),
  check: (jobId) => axiosInstance.get(`/saved-jobs/check/${jobId}`),
  updateNotes: (id, data) => axiosInstance.put(`/saved-jobs/${id}`, data),
  remove: (id) => axiosInstance.delete(`/saved-jobs/${id}`),
};

export const notificationApi = {
  getAll: (params) => axiosInstance.get('/notifications', { params }),
  getUnreadCount: () => axiosInstance.get('/notifications/unread-count'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),
};

export const dashboardApi = {
  getRecruiterStats: () => axiosInstance.get('/dashboard/recruiter'),
  getJobSeekerStats: () => axiosInstance.get('/dashboard/job-seeker'),
  getAdminStats: () => axiosInstance.get('/dashboard/admin'),
};

export const adminApi = {
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getUser: (id) => axiosInstance.get(`/admin/users/${id}`),
  toggleUserStatus: (id) =>
    axiosInstance.put(`/admin/users/${id}/toggle-status`),
  updateUserRole: (id, data) =>
    axiosInstance.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  getReports: (params) => axiosInstance.get('/admin/reports', { params }),
};


