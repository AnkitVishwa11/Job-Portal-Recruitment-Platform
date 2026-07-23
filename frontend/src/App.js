import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import { USER_ROLES } from './utils/constants';

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const JobList = lazy(() => import('./pages/public/JobList'));
const Profile = lazy(() => import('./pages/public/Profile'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// Job Seeker Pages
const JobSeekerDashboard = lazy(() => import('./pages/jobseeker/Dashboard'));

// Recruiter Pages
const RecruiterDashboard = lazy(() => import('./pages/recruiter/Dashboard'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

const AppContent = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Suspense fallback={<LoadingSpinner text="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/profile" element={
              <ProtectedRoute roles={Object.values(USER_ROLES)}>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Job Seeker Routes */}
            <Route path="/jobseeker/dashboard" element={
              <ProtectedRoute roles={[USER_ROLES.JOBSEEKER]}>
                <JobSeekerDashboard />
              </ProtectedRoute>
            } />

            {/* Recruiter Routes */}
            <Route path="/recruiter/dashboard" element={
              <ProtectedRoute roles={[USER_ROLES.RECRUITER]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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


