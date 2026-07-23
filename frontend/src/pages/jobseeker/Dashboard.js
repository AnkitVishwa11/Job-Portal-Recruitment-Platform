import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/authApi';
import { applicationApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { timeAgo, getStatusBadgeClass } from '../../utils/helpers';

const JobSeekerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          dashboardApi.getJobSeekerStats(),
          applicationApi.getUserApplications({ limit: 5, sort: '-createdAt' }),
        ]);
        setStats(statsRes.data.data);
        setRecentApplications(appsRes.data.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Job Seeker Dashboard</h4>
            <p className="text-muted mb-0">Track your job applications and activity</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            <i className="bi bi-search me-2"></i>Browse Jobs
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-send-check text-primary fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.totalApplications || 0}</h3>
                <small className="text-muted">Total Applications</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-clock-history text-warning fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.pendingApplications || 0}</h3>
                <small className="text-muted">Pending Review</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-check-circle text-success fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.shortlisted || 0}</h3>
                <small className="text-muted">Shortlisted</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-trophy text-success fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.hired || 0}</h3>
                <small className="text-muted">Hired</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Recent Applications</h5>
                <Link to="/jobseeker/applications" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="card-body p-0">
                {recentApplications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-file-earmark-text text-muted" style={{ fontSize: '2.5rem' }}></i>
                    <p className="text-muted mt-2 mb-0">No applications yet</p>
                    <Link to="/jobs" className="btn btn-primary btn-sm mt-2">Start Applying</Link>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {recentApplications.map((app) => (
                      <div key={app._id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              <Link to={`/jobs/${app.job?._id}`} className="text-decoration-none">
                                {app.job?.title || 'Job Title'}
                              </Link>
                            </h6>
                            <small className="text-muted d-block">
                              {app.company?.name || app.job?.company?.name || 'Company'}
                            </small>
                            <small className="text-muted">
                              Applied {timeAgo(app.createdAt)}
                            </small>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Quick Actions</h5>
                <div className="d-grid gap-2">
                  <Link to="/jobs" className="btn btn-outline-primary text-start">
                    <i className="bi bi-search me-2"></i>Search Jobs
                  </Link>
                  <Link to="/jobseeker/applications" className="btn btn-outline-primary text-start">
                    <i className="bi bi-file-earmark-text me-2"></i>My Applications
                  </Link>
                  <Link to="/jobseeker/saved-jobs" className="btn btn-outline-primary text-start">
                    <i className="bi bi-bookmark me-2"></i>Saved Jobs
                  </Link>
                  <Link to="/profile" className="btn btn-outline-primary text-start">
                    <i className="bi bi-person me-2"></i>Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Profile Status</h5>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Profile Completeness</small>
                    <small className="fw-bold">{stats?.profileCompletion || 0}%</small>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${stats?.profileCompletion || 0}%` }}
                      aria-valuenow={stats?.profileCompletion || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                {stats?.profileCompletion < 100 && (
                  <Link to="/profile" className="btn btn-sm btn-outline-primary w-100">
                    Complete Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;


