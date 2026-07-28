import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { USER_ROLES } from '../../utils/constants';

const Register = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.JOBSEEKER,
    phone: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setIsSubmitting(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
      };

      const user = await register(userData);
      toast.success(`Welcome, ${user.firstName}! Your account has been created.`);

      const dashboardRoutes = {
        [USER_ROLES.ADMIN]: '/admin/dashboard',
        [USER_ROLES.RECRUITER]: '/recruiter/dashboard',
        [USER_ROLES.JOBSEEKER]: '/jobseeker/dashboard',
      };
      navigate(dashboardRoutes[user.role] || '/');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <i className="bi bi-briefcase-fill text-primary fs-1"></i>
                <h4 className="fw-bold mt-2">Create Account</h4>
              </Link>
              <p className="text-muted">Join JobPortal and start your journey</p>
            </div>

            {/* Progress Steps */}
            <div className="d-flex justify-content-center mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="d-flex align-items-center">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                      s <= step ? 'bg-primary text-white' : 'bg-light text-muted'
                    }`}
                    style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`mx-2 ${s < step ? 'bg-primary' : 'bg-light'}`}
                      style={{ width: '40px', height: '3px', borderRadius: '2px' }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <>
                      <h5 className="fw-bold mb-3">Personal Information</h5>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">First Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">Last Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-medium">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-medium">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h5 className="fw-bold mb-3">Account Type & Password</h5>
                      <div className="mb-3">
                        <label className="form-label fw-medium">I want to... *</label>
                        <div className="d-grid gap-2">
                          <div
                            className={`form-check card p-3 border ${
                              formData.role === USER_ROLES.JOBSEEKER ? 'border-primary bg-primary bg-opacity-10' : ''
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setFormData((prev) => ({ ...prev, role: USER_ROLES.JOBSEEKER }))}
                          >
                            <div className="d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input me-3"
                                name="role"
                                value={USER_ROLES.JOBSEEKER}
                                checked={formData.role === USER_ROLES.JOBSEEKER}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px' }}
                              />
                              <div>
                                <h6 className="mb-0">Find a Job</h6>
                                <small className="text-muted">I'm looking for employment opportunities</small>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`form-check card p-3 border ${
                              formData.role === USER_ROLES.RECRUITER ? 'border-primary bg-primary bg-opacity-10' : ''
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setFormData((prev) => ({ ...prev, role: USER_ROLES.RECRUITER }))}
                          >
                            <div className="d-flex align-items-center">
                              <input
                                type="radio"
                                className="form-check-input me-3"
                                name="role"
                                value={USER_ROLES.RECRUITER}
                                checked={formData.role === USER_ROLES.RECRUITER}
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px' }}
                              />
                              <div>
                                <h6 className="mb-0">Hire Talent</h6>
                                <small className="text-muted">I'm a recruiter looking to hire</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-medium">Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 6 characters"
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-medium">Confirm Password *</label>
                          <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat your password"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <h5 className="fw-bold mb-3">Review & Agree</h5>
                      <div className="bg-light p-3 rounded mb-3">
                        <div className="mb-2">
                          <strong>Name:</strong> {formData.firstName} {formData.lastName}
                        </div>
                        <div className="mb-2">
                          <strong>Email:</strong> {formData.email}
                        </div>
                        <div className="mb-2">
                          <strong>Phone:</strong> {formData.phone || 'Not provided'}
                        </div>
                        <div>
                          <strong>Account Type:</strong>{' '}
                          {formData.role === USER_ROLES.RECRUITER ? 'Recruiter (Hiring)' : 'Job Seeker'}
                        </div>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="agree"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label className="form-check-label small" htmlFor="agree">
                          I agree to the{' '}
                          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>{' '}
                          and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        </label>
                      </div>
                    </>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    {step > 1 && (
                      <button type="button" className="btn btn-outline-secondary flex-fill" onClick={prevStep}>
                        <i className="bi bi-arrow-left me-1"></i> Back
                      </button>
                    )}
                    {step < 3 ? (
                      <button type="button" className="btn btn-primary flex-fill" onClick={nextStep}>
                        Continue <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-success flex-fill" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <p className="text-center mt-3 text-muted small">
              Already have an account?{' '}
              <Link to="/login" className="text-decoration-none fw-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


