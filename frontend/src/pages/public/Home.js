import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatSalary, timeAgo } from '../../utils/helpers';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes] = await Promise.all([
          jobApi.search({ limit: 6, status: 'open', sort: '-createdAt' }),
        ]);
        setFeaturedJobs(jobsRes.data?.data?.jobs || []);
        setStats(jobsRes.data?.data?.stats || null);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes = {
        admin: '/admin/dashboard',
        recruiter: '/recruiter/dashboard',
        jobseeker: '/jobseeker/dashboard',
      };
      if (dashboardRoutes[user.role]) {
        navigate(dashboardRoutes[user.role], { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationFilter) params.set('location', locationFilter);
    navigate(`/jobs?${params.toString()}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 py-5">
              <h1 className="display-4 fw-bold mb-3">Find Your Dream Job Today</h1>
              <p className="lead mb-4 opacity-90">
                Connect with top companies and opportunities. Your next career move starts here.
              </p>
              <form onSubmit={handleSearch} className="mb-3">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Job title, keyword, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control d-none d-md-block"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                  <button className="btn btn-light px-4 fw-bold" type="submit">
                    Search Jobs
                  </button>
                </div>
              </form>
              <div className="d-flex gap-3 flex-wrap">
                {!isAuthenticated && (
                  <>
                    <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                      <i className="bi bi-person-plus me-2"></i>Create Account
                    </Link>
                    <Link to="/login" className="btn btn-light btn-lg px-4">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <i className="bi bi-briefcase-fill" style={{ fontSize: '12rem', opacity: '0.3' }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-4 bg-light">
          <div className="container">
            <div className="row text-center g-3">
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <h3 className="fw-bold text-primary mb-0">{stats.activeJobs || 0}+</h3>
                  <small className="text-muted">Active Jobs</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <h3 className="fw-bold text-primary mb-0">{stats.companies || 0}+</h3>
                  <small className="text-muted">Companies</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <h3 className="fw-bold text-primary mb-0">{stats.jobSeekers || 0}+</h3>
                  <small className="text-muted">Job Seekers</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3">
                  <h3 className="fw-bold text-primary mb-0">{stats.hired || 0}+</h3>
                  <small className="text-muted">Hired</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Jobs */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Featured Jobs</h2>
            <Link to="/jobs" className="btn btn-outline-primary">
              View All Jobs <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          <div className="row g-4">
            {featuredJobs.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-briefcase text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-3">No jobs posted yet. Check back soon!</p>
              </div>
            ) : (
              featuredJobs.map((job) => (
                <div className="col-md-6 col-lg-4" key={job._id}>
                  <div className="card h-100 shadow-sm border-0 hover-shadow">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-start mb-3">
                        <div className="rounded bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-building fs-4 text-primary"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1">
                            <Link to={`/jobs/${job._id}`} className="text-decoration-none text-dark stretched-link">
                              {job.title}
                            </Link>
                          </h5>
                          <p className="text-muted mb-0 small">
                            {job.company?.name || 'Company Name'}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-geo-alt me-1"></i>{job.location}
                        </span>
                        <span className="badge bg-light text-dark border">
                          <i className="bi bi-clock me-1"></i>{job.employmentType?.replace('-', ' ')}
                        </span>
                        {job.workType && (
                          <span className="badge bg-light text-dark border">
                            <i className="bi bi-house-door me-1"></i>{job.workType}
                          </span>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-medium small">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="text-muted small">{timeAgo(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person-plus-fill text-primary fs-2"></i>
              </div>
              <h5>Create Account</h5>
              <p className="text-muted small">Sign up as a job seeker or recruiter in minutes.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-search-heart text-primary fs-2"></i>
              </div>
              <h5>Search & Apply</h5>
              <p className="text-muted small">Browse thousands of jobs and apply with one click.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-check-circle-fill text-primary fs-2"></i>
              </div>
              <h5>Get Hired</h5>
              <p className="text-muted small">Track applications and land your dream job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Take the Next Step?</h2>
          <p className="text-muted mb-4">Join thousands of professionals who found their dream jobs through JobPortal.</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Get Started Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;


