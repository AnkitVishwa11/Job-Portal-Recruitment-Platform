import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationApi } from '../../api/authApi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isRecruiter, isJobSeeker, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated) {
        try {
          const response = await notificationApi.getUnreadCount();
          setUnreadCount(response.data.data.count);
        } catch {
          // Silent fail
        }
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const recruiterLinks = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/recruiter/company', label: 'My Company', icon: 'bi-building' },
    { path: '/recruiter/jobs', label: 'My Jobs', icon: 'bi-briefcase' },
    { path: '/recruiter/applications', label: 'Applications', icon: 'bi-file-earmark-person' },
  ];

  const jobSeekerLinks = [
    { path: '/jobseeker/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/jobs', label: 'Browse Jobs', icon: 'bi-search' },
    { path: '/jobseeker/applications', label: 'Applications', icon: 'bi-file-earmark-text' },
    { path: '/jobseeker/saved-jobs', label: 'Saved Jobs', icon: 'bi-bookmark' },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
    { path: '/admin/jobs', label: 'Jobs', icon: 'bi-briefcase' },
    { path: '/admin/reports', label: 'Reports', icon: 'bi-graph-up' },
  ];

  const getNavLinks = () => {
    if (isAdmin) return adminLinks;
    if (isRecruiter) return recruiterLinks;
    if (isJobSeeker) return jobSeekerLinks;
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm sticky-top`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-briefcase-fill text-primary me-2"></i>
          JobPortal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-controls="navbarNav"
          aria-expanded={showMobileMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.path}>
                <Link
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className={`${link.icon} me-1`}></i>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-secondary border-0" onClick={toggleDarkMode} title="Toggle dark mode">
                <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
              </button>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/notifications">
                    <i className="bi bi-bell-fill"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="btn nav-link d-flex align-items-center gap-2"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    data-bs-toggle="dropdown"
                    aria-expanded={showUserMenu}
                  >
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <span className="d-none d-md-inline">{user?.firstName}</span>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end ${showUserMenu ? 'show' : ''}`}>
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-person me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/notifications" onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-bell me-2"></i>Notifications
                        {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm" to="/register">
                    <i className="bi bi-person-plus me-1"></i>Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


