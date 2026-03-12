import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../css/app.css';

const API = import.meta.env.VITE_API_URL || 'https://leap-backend-6ttf.onrender.com';

const Login = ({ switchToRegister }) => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, creds);
      login(res.data.token, res.data.user);
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split">
        <div className="auth-form-section">
          <h2 className="auth-title">Sign In</h2>
          <div className="social-login">
            <button className="social-btn" title="Sign in with Google"><i className="fab fa-google"></i></button>
            <button className="social-btn" title="Sign in with GitHub"><i className="fab fa-github"></i></button>
            <button className="social-btn" title="Sign in with LinkedIn"><i className="fab fa-linkedin-in"></i></button>
          </div>
          <p className="divider-text">or use your school email and password</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email (@gbox.ncf.edu.ph)"
              className="auth-input"
              required
              value={creds.email}
              onChange={e => setCreds({ ...creds, email: e.target.value })}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              required
              value={creds.password}
              onChange={e => setCreds({ ...creds, password: e.target.value })}
              disabled={loading}
            />
            <a href="#" className="forgot-password">Forgot your password?</a>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span className="loading"></span> Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#718096', fontSize: '14px' }}>
            Don't have an account?{' '}
            <span onClick={switchToRegister} style={{ color: '#22c55e', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
              Sign up here
            </span>
          </p>
        </div>
        <div className="auth-welcome-section">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="welcome-subtitle">Enter your credentials to access your account</p>
          <button className="auth-switch-btn" onClick={switchToRegister}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;