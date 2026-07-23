import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      admin: '/admin/dashboard',
      recruiter: '/recruiter/dashboard',
      jobseeker: '/jobseeker/dashboard',
    };
    return <Navigate to={redirectMap[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;


