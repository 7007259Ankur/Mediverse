import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

try {
  const response = await axios.post(
    `${API_BASE_URL}/api/auth/register`,
    formData,
    {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: (status) => status < 500,
    }
  );


      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.msg || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header Section */}
        <header className="register-header">
          <h1 className="register-title">Join HealthVerse</h1>
          <p className="register-subtitle">
            Already have an account?{' '}
            <Link to="/login" className="register-link">
              Sign in here
            </Link>
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg 
              className="error-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="At least 6 characters"
            />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              I am registering as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input form-select"
            >
              <option value="user">Patient</option>
              <option value="doctor">Healthcare Provider</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <>
                <svg 
                  className="spinner" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="42" strokeDashoffset="16"/>
                </svg>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <footer className="register-footer">
          <p className="terms-text">
            By registering, you agree to our{' '}
            <Link to="/terms" className="footer-link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;