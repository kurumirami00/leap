import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    role: 'student',
    year_level: '',
    dept_id: '',
    specialization: '',
    contact_no: ''
  });

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email.endsWith('@gbox.ncf.edu.ph') && !form.email.endsWith('@ncf.edu.ph')) {
      setError('Only @gbox.ncf.edu.ph or @ncf.edu.ph addresses are allowed');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('Account created. Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card reverse">
        <div className="auth-welcome-side">
          <h1>Hello</h1>
          <p>Register with your school details to get started</p>
          <Link to="/login"><button className="auth-alt-btn">Sign In</button></Link>
        </div>

        <div className="auth-form-side">
          <h2>Create Account</h2>
          <p className="auth-notice">
            Only <strong>@gbox.ncf.edu.ph</strong> email addresses are allowed
          </p>

          {error && (
            <p style={{ color: '#e03a3a', fontSize: '13px', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <select
              className="auth-input auth-select"
              value={form.role}
              onChange={set('role')}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>

            <div className="auth-row">
              <input className="auth-input" type="text" placeholder="First Name" required value={form.first_name} onChange={set('first_name')} disabled={loading} />
              <input className="auth-input" type="text" placeholder="Last Name" required value={form.last_name} onChange={set('last_name')} disabled={loading} />
            </div>

            <input className="auth-input" type="text" placeholder="Middle Name (optional)" value={form.middle_name} onChange={set('middle_name')} disabled={loading} />

            <select className="auth-input auth-select" value={form.gender} onChange={set('gender')} disabled={loading}>
              <option value="">Gender (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>

            {form.role === 'student' && (
              <div className="auth-row">
                <input className="auth-input" type="number" placeholder="Year Level" value={form.year_level} onChange={set('year_level')} disabled={loading} min="1" max="5" />
                <input className="auth-input" type="number" placeholder="Dept ID (optional)" value={form.dept_id} onChange={set('dept_id')} disabled={loading} />
              </div>
            )}

            {form.role === 'instructor' && (
              <>
                <input className="auth-input" type="text" placeholder="Specialization" value={form.specialization} onChange={set('specialization')} disabled={loading} />
                <input className="auth-input" type="text" placeholder="Contact Number" value={form.contact_no} onChange={set('contact_no')} disabled={loading} />
              </>
            )}

            <input
              className="auth-input"
              type="email"
              placeholder="Email (@gbox.ncf.edu.ph)"
              required
              value={form.email}
              onChange={set('email')}
              disabled={loading}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password (min. 6 characters)"
              required
              value={form.password}
              onChange={set('password')}
              disabled={loading}
              minLength="6"
            />

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Creating account...</> : 'Sign Up'}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
