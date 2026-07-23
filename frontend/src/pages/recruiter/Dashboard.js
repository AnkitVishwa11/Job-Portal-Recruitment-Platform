import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStatusBadgeClass } from '../../utils/helpers';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getRecruiterStats();
        setStats(response.data.data);
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
            <h4 className="fw-bold mb-1">Recruiter Dashboard</h4>
            <p className="text-muted mb-0">Manage your jobs and applicants</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/recruiter/company" className="btn btn-outline-primary">
              <i className="bi bi-building me-2"></i>My Company
            </Link>
            <Link to="/recruiter/jobs/create" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>Post a Job
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-briefcase text-primary fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.totalJobs || 0}</h3>
                <small className="text-muted">Total Jobs</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-check-circle text-success fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.activeJobs || 0}</h3>
                <small className="text-muted">Active Jobs</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-file-earmark-person text-warning fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.totalApplications || 0}</h3>
                <small className="text-muted">Total Applications</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-people text-info fs-5"></i>
                </div>
                <h3 className="fw-bold mb-0">{stats?.newApplicants || 0}</h3>
                <small className="text-muted">New Applicants</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Recent Applications</h5>
                <Link to="/recruiter/applications" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="card-body p-0">
                {(!stats?.recentApplications || stats.recentApplications.length === 0) ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
                    <p className="text-muted mt-2 mb-0">No applications received yet</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentApplications.slice(0, 5).map((app) => (
                      <div key={app._id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="bi bi-person text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1">
                                {app.user?.firstName} {app.user?.lastName}
                              </h6>
                              <small className="text-muted">
                                Applied to: {app.job?.title || 'Position'}
                              </small>
                            </div>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2 ms-5">
                          <Link to={`/recruiter/applications/${app._id}`} className="btn btn-sm btn-outline-primary me-2">
                            Review
                          </Link>
                          {app.resume?.url && (
                            <a href={app.resume.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                              <i className="bi bi-file-earmark-text me-1"></i>Resume
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-5">
            {/* Active Jobs */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Active Jobs</h5>
                <Link to="/recruiter/jobs" className="btn btn-sm btn-outline-primary">Manage</Link>
              </div>
              <div className="card-body p-0">
                {(!stats?.recentJobs || stats.recentJobs.length === 0) ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No active jobs</p>
                    <Link to="/recruiter/jobs/create" className="btn btn-primary btn-sm mt-2">Post a Job</Link>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentJobs.slice(0, 4).map((job) => (
                      <div key={job._id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">
                              <Link to={`/recruiter/jobs/${job._id}`} className="text-decoration-none">
                                {job.title}
                              </Link>
                            </h6>
                            <small className="text-muted">
                              {job.applicationCount || 0} applicants | {job.location}
                            </small>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Quick Actions</h5>
                <div className="d-grid gap-2">
                  <Link to="/recruiter/jobs/create" className="btn btn-outline-primary text-start">
                    <i className="bi bi-plus-circle me-2"></i>Post New Job
                  </Link>
                  <Link to="/recruiter/jobs" className="btn btn-outline-primary text-start">
                    <i className="bi bi-list-check me-2"></i>Manage Jobs
                  </Link>
                  <Link to="/recruiter/applications" className="btn btn-outline-primary text-start">
                    <i className="bi bi-people me-2"></i>View Applicants
                  </Link>
                  <Link to="/recruiter/company" className="btn btn-outline-primary text-start">
                    <i className="bi bi-building me-2"></i>Update Company
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;


