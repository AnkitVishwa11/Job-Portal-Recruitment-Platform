import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobApi, applicationApi, savedJobApi } from '../../api/authApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatSalary, timeAgo, capitalize } from '../../utils/helpers';
import { toast } from 'react-toastify';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Saved status state
  const [isSaved, setIsSaved] = useState(false);
  const [savedJobId, setSavedJobId] = useState(null);
  const [checkingSave, setCheckingSave] = useState(false);
  
  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applyForm, setApplyForm] = useState({
    resume: null,
    coverLetter: ''
  });

  const checkSavedStatus = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'jobseeker') return;
    try {
      setCheckingSave(true);
      const res = await savedJobApi.check(id);
      setIsSaved(res.data?.data?.isSaved || false);
      setSavedJobId(res.data?.data?.savedJob?._id || null);
    } catch (err) {
      console.error('Failed to check saved status:', err);
    } finally {
      setCheckingSave(false);
    }
  }, [id, isAuthenticated, user]);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await jobApi.getById(id);
      setJob(res.data?.data?.job || null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
    checkSavedStatus();
  }, [fetchJobDetails, checkSavedStatus]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.warning('Please log in to save jobs');
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can save jobs');
      return;
    }

    try {
      if (isSaved) {
        await savedJobApi.remove(savedJobId);
        toast.success('Job removed from saved list');
        setIsSaved(false);
        setSavedJobId(null);
      } else {
        const res = await savedJobApi.save({ jobId: id });
        toast.success('Job bookmarked successfully');
        setIsSaved(true);
        setSavedJobId(res.data?.data?.savedJob?._id || null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleFileChange = (e) => {
    setApplyForm(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setApplyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.resume) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setSubmittingApply(true);
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', applyForm.resume);
      if (applyForm.coverLetter) {
        formData.append('coverLetter', applyForm.coverLetter);
      }

      await applicationApi.apply(formData);
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      navigate('/jobseeker/applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingApply(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading job details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!job) return <ErrorMessage message="Job not found" />;

  const isJobSeeker = isAuthenticated && user?.role === 'jobseeker';

  return (
    <div className="job-detail-page py-5 bg-light min-vh-100">
      <div className="container">
        {/* Back Link */}
        <Link to="/jobs" className="btn btn-link text-decoration-none p-0 mb-4 text-primary fw-medium">
          <i className="bi bi-arrow-left me-2"></i>Back to Jobs List
        </Link>

        {/* Job Header Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center">
              <div className="col-auto mb-3 mb-md-0">
                <div className="rounded bg-primary bg-opacity-10 p-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-building fs-1 text-primary"></i>
                </div>
              </div>
              <div className="col-md col-12">
                <div className="d-flex flex-wrap gap-2 mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary text-capitalize">{job.workType}</span>
                  <span className="badge bg-secondary bg-opacity-10 text-secondary text-capitalize">{job.employmentType}</span>
                  <span className="badge bg-info bg-opacity-10 text-info text-capitalize">{job.experienceLevel} Experience</span>
                </div>
                <h2 className="fw-bold mb-1">{job.title}</h2>
                <h5 className="text-muted mb-2">{job.company?.name || 'Company Name'}</h5>
                <div className="d-flex flex-wrap gap-3 text-muted small">
                  <span><i className="bi bi-geo-alt me-1"></i>{job.location}</span>
                  <span><i className="bi bi-clock me-1"></i>Posted {timeAgo(job.createdAt)}</span>
                  {job.salaryRange && (
                    <span className="text-primary fw-medium">
                      <i className="bi bi-cash-stack me-1"></i>
                      {formatSalary(job.salaryMin, job.salaryMax)} / year
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-auto col-12 mt-4 mt-md-0 d-flex gap-2">
                {isJobSeeker && (
                  <button 
                    onClick={handleSaveToggle}
                    className="btn btn-outline-primary px-4 py-2"
                    disabled={checkingSave}
                  >
                    <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} me-2`}></i>
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.warning('Please log in to apply for this job');
                      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
                      return;
                    }
                    if (user?.role !== 'jobseeker') {
                      toast.error('Only job seekers can apply for jobs');
                      return;
                    }
                    setShowApplyModal(true);
                  }}
                  className="btn btn-primary px-4 py-2"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job Content Row */}
        <div className="row g-4">
          {/* Main Description */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold mb-3 border-bottom pb-2">Job Description</h5>
                <p className="text-muted leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                  {job.description}
                </p>

                {job.requirements && job.requirements.length > 0 && (
                  <>
                    <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">Requirements</h5>
                    <ul className="text-muted">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="mb-2">{req}</li>
                      ))}
                    </ul>
                  </>
                )}

                {job.responsibilities && job.responsibilities.length > 0 && (
                  <>
                    <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">Key Responsibilities</h5>
                    <ul className="text-muted">
                      {job.responsibilities.map((resp, index) => (
                        <li key={index} className="mb-2">{resp}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Specs */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2">Required Skills</h5>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {job.skills && job.skills.map((skill, index) => (
                    <span className="badge bg-light text-dark border p-2" key={index}>
                      {skill}
                    </span>
                  ))}
                </div>

                <h5 className="fw-bold mb-3 border-bottom pb-2">Job Details Overview</h5>
                <div className="mb-3">
                  <small className="text-muted d-block">Industry</small>
                  <span className="fw-medium">{job.company?.industry || 'Software Engineering'}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Employment Type</small>
                  <span className="fw-medium text-capitalize">{job.employmentType}</span>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Positions Available</small>
                  <span className="fw-medium">{job.positions || 1}</span>
                </div>
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <small className="text-muted d-block mb-1">Benefits</small>
                    <div className="d-flex flex-wrap gap-1">
                      {job.benefits.map((benefit, index) => (
                        <span className="badge bg-success bg-opacity-10 text-success" key={index}>{benefit}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Apply for {job.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body py-4">
                  <div className="mb-3">
                    <label htmlFor="resume" className="form-label fw-medium">Upload Resume (PDF/DOCX) <span className="text-danger">*</span></label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="resume" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required 
                    />
                    <div className="form-text small">Please upload a valid PDF or DOCX file (max 5MB)</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="coverLetter" className="form-label fw-medium">Cover Letter (Optional)</label>
                    <textarea 
                      className="form-control" 
                      id="coverLetter" 
                      name="coverLetter"
                      rows="4" 
                      placeholder="Explain why you are a great fit for this role..."
                      value={applyForm.coverLetter}
                      onChange={handleTextChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4" disabled={submittingApply}>
                    {submittingApply ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
