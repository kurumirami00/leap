import React, { useState } from 'react';
import axios from 'axios';
import '../css/app.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Register = ({ switchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        role: 'student',
        // student-specific
        year_level: '',
        dept_id: '',
        // instructor-specific
        specialization: '',
        contact_no: '',
    });
    const [loading, setLoading] = useState(false);

    const isStudent    = formData.role === 'student';
    const isInstructor = formData.role === 'instructor';

    const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email.endsWith('@gbox.ncf.edu.ph')) {
            alert('Only @gbox.ncf.edu.ph email addresses are allowed');
            return;
        }
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API}/api/auth/register`, formData);
            alert('Account created successfully! Please sign in.');
            switchToLogin();
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const dropdownStyle = {
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '20px',
        paddingRight: '40px',
        cursor: 'pointer',
    };

    return (
        <div className="auth-container">
            <div className="auth-split reverse">
                <div className="auth-welcome-section">
                    <h1 className="welcome-title">Hello, Friend!</h1>
                    <p className="welcome-subtitle">Register with your school details to unlock all LEAP features</p>
                    <button className="auth-switch-btn" onClick={switchToLogin}>SIGN IN</button>
                </div>
                <div className="auth-form-section">
                    <h2 className="auth-title">Create Account</h2>
                    <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,.1),rgba(22,163,74,.1))', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(34,197,94,.3)' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', textAlign: 'center', fontWeight: '500' }}>
                            📧 Only <strong>@gbox.ncf.edu.ph</strong> email addresses are allowed
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Role */}
                        <select className="auth-input" value={formData.role} onChange={set('role')} disabled={loading} required style={dropdownStyle}>
                            <option value="student">👨‍🎓 Student</option>
                            <option value="instructor">👨‍🏫 Instructor</option>
                        </select>

                        {/* Name row */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input className="auth-input" type="text" placeholder="First Name" required value={formData.first_name} onChange={set('first_name')} disabled={loading} />
                            <input className="auth-input" type="text" placeholder="Last Name"  required value={formData.last_name}  onChange={set('last_name')}  disabled={loading} />
                        </div>
                        <input className="auth-input" type="text" placeholder="Middle Name (optional)" value={formData.middle_name} onChange={set('middle_name')} disabled={loading} />

                        {/* Gender */}
                        <select className="auth-input" value={formData.gender} onChange={set('gender')} disabled={loading} style={dropdownStyle}>
                            <option value="">Gender (optional)</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>

                        {/* Student-specific fields */}
                        {isStudent && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input className="auth-input" type="number" placeholder="Year Level" value={formData.year_level} onChange={set('year_level')} disabled={loading} min="1" max="5" />
                                <input className="auth-input" type="number" placeholder="Dept ID (optional)" value={formData.dept_id} onChange={set('dept_id')} disabled={loading} />
                            </div>
                        )}

                        {/* Instructor-specific fields */}
                        {isInstructor && (
                            <>
                                <input className="auth-input" type="text" placeholder="Specialization" value={formData.specialization} onChange={set('specialization')} disabled={loading} />
                                <input className="auth-input" type="text" placeholder="Contact Number" value={formData.contact_no} onChange={set('contact_no')} disabled={loading} />
                            </>
                        )}

                        {/* Credentials */}
                        <input className="auth-input" type="email" placeholder="Email (@gbox.ncf.edu.ph)" required value={formData.email} onChange={set('email')} disabled={loading}
                            pattern=".*@gbox\.ncf\.edu\.ph$" title="Please use an @gbox.ncf.edu.ph email address" />
                        <input className="auth-input" type="password" placeholder="Password (min. 6 characters)" required value={formData.password} onChange={set('password')} disabled={loading} minLength="6" />

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <span className="loading"></span> CREATING ACCOUNT...
                                </span>
                            ) : 'SIGN UP'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '25px', color: '#718096', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <span onClick={switchToLogin} style={{ color: '#22c55e', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                            Sign in here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
