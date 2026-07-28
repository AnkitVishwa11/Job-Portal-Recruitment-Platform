import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { savedJobApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { timeAgo } from '../../utils/helpers';
import { toast } from 'react-toastify';

const JobSeekerSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await savedJobApi.getAll({ sort: '-createdAt' });
      setSavedJobs(res.data?.data?.savedJobs || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (savedJobId) => {
    try {
      await savedJobApi.remove(savedJobId);
      toast.success('Job removed from saved list');
      setSavedJobs((prev) => prev.filter((item) => item._id !== savedJobId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove saved job');
    }
  };

  if (loading) return <LoadingSpinner text="Loading saved jobs..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="saved-jobs-page py-4 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Saved Jobs</h4>
            <p className="text-muted mb-0">Manage jobs you've bookmarked for later</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>Browse Jobs
          </Link>
        </div>

        <div className="row g-3">
          {savedJobs.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm py-5 text-center">
                <div className="card-body">
                  <i className="bi bi-bookmark text-muted" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3 fw-bold">No saved jobs</h5>
                  <p className="text-muted">You haven't bookmarked any jobs yet.</p>
                  <Link to="/jobs" className="btn btn-primary mt-2">Browse Jobs</Link>
                </div>
              </div>
            </div>
          ) : (
            savedJobs.map((item) => {
              const job = item.job;
              if (!job) return null;
              return (
                <div className="col-md-6 col-lg-4" key={item._id}>
                  <div className="card border-0 shadow-sm h-100 position-relative">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="btn btn-sm btn-light border-0 rounded-circle position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px', zIndex: 2 }}
                      title="Remove bookmark"
                    >
                      <i className="bi bi-bookmark-fill text-primary"></i>
                    </button>
                    
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary mb-2 text-capitalize">
                          {job.workType}
                        </span>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary ms-2 text-capitalize">
                          {job.employmentType}
                        </span>
                      </div>

                      <h5 className="card-title fw-bold mb-1">
                        <Link to={`/jobs/${job._id}`} className="text-decoration-none text-dark hover-primary">
                          {job.title}
                        </Link>
                      </h5>

                      <h6 className="text-muted small mb-3">
                        {job.company?.name || 'Company Name'}
                      </h6>

                      <p className="text-muted small mb-4 flex-grow-1 text-truncate-3">
                        {job.description}
                      </p>

                      <div className="border-top pt-3 mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted small">
                            <i className="bi bi-geo-alt me-1"></i>
                            {job.location}
                          </span>
                          <span className="text-muted small">
                            Saved {timeAgo(item.createdAt)}
                          </span>
                        </div>
                        
                        <div className="d-grid gap-2 mt-3">
                          <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-primary">
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerSavedJobs;
