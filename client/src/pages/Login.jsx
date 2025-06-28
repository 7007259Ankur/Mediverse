import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { API_BASE_URL } from '../utils/constant';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const payload = { ...formData, email: formData.email.toLowerCase() };

     const res = await axios.post(`${API_BASE_URL}/api/auth/login`, payload, {
  headers: { 'Content-Type': 'application/json' }
});


      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user }));

        const redirectMap = {
          'admin': '/admin',
          'doctor': '/doctor',
          'user': '/patient'
        };
        navigate(redirectMap[res.data.user.role] || '/');
      } else {
        dispatch(loginFailure(res.data.message || 'Login failed'));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                     10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h1 className="brand-name">HealthVerse</h1>
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to access your dashboard</p>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                       10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" fill="none" />
                </svg>
                Signing in...
              </>
            ) : 'Sign in'}
          </button>
        </form>

        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">OR</span>
          <span className="divider-line"></span>
        </div>

        <button className="google-button" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-footer">
          <Link to="/register" className="signup-link">Create account</Link>
          <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;