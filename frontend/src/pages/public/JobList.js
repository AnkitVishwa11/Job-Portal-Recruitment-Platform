import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { jobApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import { formatSalary, timeAgo, capitalize } from '../../utils/helpers';
import { EMPLOYMENT_TYPES, WORK_TYPES, EXPERIENCE_LEVELS, SALARY_RANGES, PAGINATION } from '../../utils/constants';

const JobList = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    employmentType: searchParams.get('employmentType') || '',
    workType: searchParams.get('workType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    salaryRange: searchParams.get('salaryRange') || '',
  });
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE,
    limit: parseInt(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: sortBy,
        status: 'open',
      };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.employmentType) params.employmentType = filters.employmentType;
      if (filters.workType) params.workType = filters.workType;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
      if (filters.salaryRange) {
        const [min, max] = filters.salaryRange.split('-');
        if (min) params.salaryMin = parseInt(min);
        if (max) params.salaryMax = parseInt(max);
      }

      const response = await jobApi.search(params);
      setJobs(response.data.data.jobs || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.data.pagination?.total || 0,
        totalPages: response.data.data.pagination?.totalPages || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortBy, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', employmentType: '', workType: '', experienceLevel: '', salaryRange: '' });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="jobs-page py-4">
      <div className="container">
        <div className="row">
          {/* Filters Sidebar */}
          <div className={`col-lg-3 mb-4 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Filters</h5>
                  <button className="btn btn-sm btn-link text-decoration-none d-lg-none" onClick={() => setShowFilters(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Search</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Job title, keyword..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Location</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Employment Type</label>
                  <select className="form-select form-select-sm" value={filters.employmentType} onChange={(e) => handleFilterChange('employmentType', e.target.value)}>
                    <option value="">All Types</option>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Work Type</label>
                  <select className="form-select form-select-sm" value={filters.workType} onChange={(e) => handleFilterChange('workType', e.target.value)}>
                    <option value="">All</option>
                    {WORK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Experience Level</label>
                  <select className="form-select form-select-sm" value={filters.experienceLevel} onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}>
                    <option value="">All Levels</option>
                    {EXPERIENCE_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium small">Salary Range</label>
                  <select className="form-select form-select-sm" value={filters.salaryRange} onChange={(e) => handleFilterChange('salaryRange', e.target.value)}>
                    <option value="">Any Salary</option>
                    {SALARY_RANGES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <button className="btn btn-outline-secondary btn-sm w-100" onClick={clearFilters}>
                    <i className="bi bi-x-circle me-1"></i>Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Top bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary btn-sm d-lg-none" onClick={() => setShowFilters(!showFilters)}>
                  <i className="bi bi-funnel me-1"></i>Filters
                </button>
                <span className="text-muted small">{pagination.total} jobs found</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <label className="text-muted small mb-0">Sort:</label>
                <select className="form-select form-select-sm" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="-salaryMin">Salary: High to Low</option>
                  <option value="salaryMin">Salary: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Searching jobs..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchJobs} />
            ) : jobs.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">No jobs found</h5>
                <p className="text-muted">Try adjusting your search filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="row g-3">
                {jobs.map((job) => (
                  <div className="col-md-6" key={job._id}>
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start mb-2">
                          <div className="rounded bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                            <i className="bi bi-building fs-5 text-primary"></i>
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="card-title mb-0 text-truncate">
                              <Link to={`/jobs/${job._id}`} className="text-decoration-none text-dark stretched-link">
                                {job.title}
                              </Link>
                            </h6>
                            <small className="text-muted">{job.company?.name || 'Company'}</small>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          <span className="badge bg-light text-dark border small">
                            <i className="bi bi-geo-alt me-1"></i>{job.location}
                          </span>
                          <span className="badge bg-light text-dark border small">
                            {capitalize(job.employmentType?.replace('-', ' '))}
                          </span>
                          {job.workType && (
                            <span className="badge bg-light text-dark border small">{job.workType}</span>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-primary fw-medium">{formatSalary(job.salaryMin, job.salaryMax)}</small>
                          <small className="text-muted">{timeAgo(job.createdAt)}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                onLimitChange={(limit) => setPagination((prev) => ({ ...prev, limit, page: 1 }))}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;


