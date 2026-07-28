import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import { USER_ROLES } from './utils/constants';

// Page Imports
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobList from './pages/public/JobList';
import JobDetail from './pages/public/JobDetail';
import Profile from './pages/public/Profile';
import NotFound from './pages/public/NotFound';
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import JobSeekerApplications from './pages/jobseeker/Applications';
import JobSeekerSavedJobs from './pages/jobseeker/SavedJobs';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

const AppContent = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={Object.values(USER_ROLES)}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Routes */}
          <Route
            path="/jobseeker/dashboard"
            element={
              <ProtectedRoute roles={[USER_ROLES.JOBSEEKER]}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/applications"
            element={
              <ProtectedRoute roles={[USER_ROLES.JOBSEEKER]}>
                <JobSeekerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/saved-jobs"
            element={
              <ProtectedRoute roles={[USER_ROLES.JOBSEEKER]}>
                <JobSeekerSavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute roles={[USER_ROLES.RECRUITER]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
