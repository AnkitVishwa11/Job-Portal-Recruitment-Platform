import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user.firstName}!`);

      const dashboardRoutes = {
        admin: '/admin/dashboard',
        recruiter: '/recruiter/dashboard',
        jobseeker: '/jobseeker/dashboard',
      };

      const redirectPath = from !== '/' ? from : dashboardRoutes[user.role] || '/';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none">
                <i className="bi bi-briefcase-fill text-primary fs-1"></i>
                <h4 className="fw-bold mt-2">JobPortal</h4>
              </Link>
              <p className="text-muted">Sign in to your account</p>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="small text-decoration-none">Forgot password?</Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-center mt-3 text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-medium">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


