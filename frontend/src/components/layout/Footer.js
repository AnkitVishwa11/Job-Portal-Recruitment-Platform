import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className={`${darkMode ? 'bg-dark text-light' : 'bg-light'} py-4 mt-auto border-top`}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-briefcase-fill text-primary me-2"></i>JobPortal
            </h6>
            <p className="small text-muted mb-0">
              Connecting talented professionals with leading companies. Find your dream job or hire the best talent.
            </p>
          </div>
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/jobs" className="text-decoration-none text-muted">Browse Jobs</Link></li>
              <li className="mb-2"><Link to="/companies" className="text-decoration-none text-muted">Companies</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-muted">Create Account</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">For Recruiters</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-muted">Post a Job</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-muted">Find Candidates</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-muted">Recruiter Login</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="mailto:support@jobportal.com" className="text-decoration-none text-muted">support@jobportal.com</a></li>
              <li className="mb-2"><span className="text-muted">+1 (555) 123-4567</span></li>
              <li className="mb-2">
                <div className="d-flex gap-2 mt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted" aria-label="GitHub"><i className="bi bi-github"></i></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <hr className={`my-3 ${darkMode ? 'border-secondary' : ''}`} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small text-muted mb-0">&copy; {year} JobPortal. All rights reserved.</p>
          <div className="d-flex gap-3 small">
            <a href="/privacy" className="text-muted text-decoration-none">Privacy Policy</a>
            <a href="/terms" className="text-muted text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


