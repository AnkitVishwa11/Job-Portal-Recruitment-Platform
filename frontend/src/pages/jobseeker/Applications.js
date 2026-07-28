import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { timeAgo, getStatusBadgeClass } from '../../utils/helpers';
import { toast } from 'react-toastify';

const JobSeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getUserApplications({ sort: '-createdAt' });
      setApplications(res.data?.data?.applications || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await applicationApi.withdraw(appId);
      toast.success('Application withdrawn successfully');
      // Refresh the application list
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  if (loading) return <LoadingSpinner text="Loading applications..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="applications-page py-4 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">My Applications</h4>
            <p className="text-muted mb-0">Track and manage your submitted job applications</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>Browse More Jobs
          </Link>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {applications.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 fw-bold">No applications found</h5>
                <p className="text-muted">You haven't submitted any job applications yet.</p>
                <Link to="/jobs" className="btn btn-primary mt-2">Find a Job</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="ps-4 py-3">Job Details</th>
                      <th scope="col" className="py-3">Applied</th>
                      <th scope="col" className="py-3">Status</th>
                      <th scope="col" className="pe-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id}>
                        <td className="ps-4 py-3">
                          <div>
                            <h6 className="fw-bold mb-1">
                              <Link to={`/jobs/${app.jobId?._id || app.job?._id}`} className="text-decoration-none text-dark">
                                {app.jobId?.title || app.job?.title || 'Unknown Job'}
                              </Link>
                            </h6>
                            <span className="text-muted small">
                              <i className="bi bi-building me-1"></i>
                              {app.companyId?.companyName || app.company?.name || app.jobId?.companyId?.companyName || app.job?.company?.name || 'Unknown Company'}
                            </span>
                            {(app.jobId?.location || app.job?.location) && (
                              <span className="text-muted small ms-3">
                                <i className="bi bi-geo-alt me-1"></i>
                                {app.jobId?.location || app.job?.location}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="small">{timeAgo(app.createdAt)}</span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="pe-4 py-3 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Link to={`/jobs/${app.jobId?._id || app.job?._id}`} className="btn btn-sm btn-outline-primary">
                              View Job
                            </Link>
                            {app.status !== 'withdrawn' && app.status !== 'rejected' && app.status !== 'hired' && (
                              <button
                                onClick={() => handleWithdraw(app._id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Withdraw
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerApplications;
