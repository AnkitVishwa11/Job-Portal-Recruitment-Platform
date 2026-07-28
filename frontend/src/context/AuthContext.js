import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getProfile();
      setUser(response.data?.data?.user || null);
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authApi.register(userData);
      const { accessToken, refreshToken, user: newUser } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken, user: loggedInUser } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Silent fail - clear local tokens anyway
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await authApi.updateProfile(profileData);
      const updatedUser = response.data.data.user;
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      throw new Error(message);
    }
  };

  const changePassword = async (passwordData) => {
    setError(null);
    try {
      await authApi.changePassword(passwordData);
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setError(message);
      throw new Error(message);
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isRecruiter = user?.role === 'recruiter';
  const isJobSeeker = user?.role === 'jobseeker';

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isRecruiter,
    isJobSeeker,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    loadUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;


