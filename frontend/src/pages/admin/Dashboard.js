import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminApi.getDashboard();
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

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: 'bi-people', color: 'primary' },
    { label: 'Job Seekers', value: stats?.jobSeekers || 0, icon: 'bi-person-badge', color: 'info' },
    { label: 'Recruiters', value: stats?.recruiters || 0, icon: 'bi-person-workspace', color: 'success' },
    { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: 'bi-briefcase', color: 'warning' },
    { label: 'Total Applications', value: stats?.totalApplications || 0, icon: 'bi-file-earmark-text', color: 'danger' },
    { label: 'Hired', value: stats?.hired || 0, icon: 'bi-trophy', color: 'success' },
  ];

  return (
    <div className="dashboard-page py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">Admin Dashboard</h4>
            <p className="text-muted mb-0">System overview and management</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/reports" className="btn btn-outline-primary">
              <i className="bi bi-graph-up me-2"></i>Reports
            </Link>
            <Link to="/admin/users" className="btn btn-primary">
              <i className="bi bi-people me-2"></i>Manage Users
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {statCards.map((card, index) => (
            <div className="col-md-4 col-6" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`rounded-circle bg-${card.color} bg-opacity-10 d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                      <i className={`bi ${card.icon} text-${card.color} fs-5`}></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{card.value}</h3>
                      <small className="text-muted">{card.label}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Users */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Recent Users</h5>
                <Link to="/admin/users" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="card-body p-0">
                {(!stats?.recentUsers || stats.recentUsers.length === 0) ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No users registered yet</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentUsers.slice(0, 5).map((user) => (
                      <div key={user._id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>
                            <div>
                              <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                              <small className="text-muted">{user.email}</small>
                            </div>
                          </div>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'recruiter' ? 'bg-primary' : 'bg-info'}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center py-3">
                <h5 className="fw-bold mb-0">Recent Jobs</h5>
                <Link to="/admin/jobs" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="card-body p-0">
                {(!stats?.recentJobs || stats.recentJobs.length === 0) ? (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No jobs posted yet</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {stats.recentJobs.slice(0, 5).map((job) => (
                      <div key={job._id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{job.title}</h6>
                            <small className="text-muted d-block">
                              {job.company?.name || 'Company'} | {job.location}
                            </small>
                            <small className="text-muted">
                              {job.applicationCount || 0} applicants
                            </small>
                          </div>
                          <span className={`badge ${job.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


