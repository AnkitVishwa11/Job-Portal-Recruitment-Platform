import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center px-4">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="fw-bold mb-2">Page Not Found</h4>
        <p className="text-muted mb-4">The page you are looking for doesn't exist or has been moved.</p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/" className="btn btn-primary px-4">
            <i className="bi bi-house-door me-2"></i>Go Home
          </Link>
          <button className="btn btn-outline-secondary px-4" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left me-2"></i>Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


