import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-form-side">
          <h2>Sign In</h2>
          <p className="auth-notice">Use your school email and password</p>

          {error && (
            <p style={{ color: '#e03a3a', fontSize: '13px', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email (@gbox.ncf.edu.ph)"
              className="auth-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <span className="auth-forgot">Forgot your password?</span>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>

        <div className="auth-welcome-side">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to access your account</p>
          <Link to="/register"><button className="auth-alt-btn">Sign Up</button></Link>
        </div>
      </div>
    </div>
  );
}
