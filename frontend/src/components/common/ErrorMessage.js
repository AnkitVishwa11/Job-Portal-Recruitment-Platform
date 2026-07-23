import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="text-center">
        <div className="mb-3">
          <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
        </div>
        <h5 className="text-danger mb-2">Something went wrong</h5>
        <p className="text-muted mb-3">{message || 'An unexpected error occurred. Please try again.'}</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;


