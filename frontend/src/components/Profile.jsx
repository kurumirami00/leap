import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState('');
  const [profile, setProfile] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    gender: '',
    address: '',
    year_level: '',
    contact_no: '',
  });
  const [snapshot, setSnapshot] = useState({});

  useEffect(() => {
    if (!user) return;
    api.get(`/users/${user.user_id}`)
      .then((res) => {
        const d = res.data;
        setProfile({
          first_name: d.first_name || '',
          middle_name: d.middle_name || '',
          last_name: d.last_name || '',
          email: d.email || '',
          gender: d.gender || '',
          address: d.address || '',
          year_level: d.year_level || '',
          contact_no: d.contact_no || '',
        });
      })
      .catch(() => {});
  }, [user]);

  function startEdit() {
    setSnapshot({ ...profile });
    setEditing(true);
  }

  function cancelEdit() {
    setProfile({ ...snapshot });
    setEditing(false);
  }

  async function saveChanges() {
    try {
      await api.put(`/users/${user.user_id}`, profile);
      setEditing(false);
      showToast('Changes saved');
    } catch {
      showToast('Save failed');
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }

  function handleLogout() {
    if (window.confirm('Log out?')) {
      logout();
      navigate('/login');
    }
  }

  function set(field) {
    return (e) => setProfile({ ...profile, [field]: e.target.value });
  }

  const displayName = `${profile.first_name} ${profile.last_name}`.trim() || 'Student';
  const initials = `${(profile.first_name || '?')[0]}${(profile.last_name || '')[0] || ''}`.toUpperCase();

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <div className="profile-avatar-section">
          <div className="profile-avatar-circle">{initials}</div>
          <p className="profile-student-name">Hi, {displayName}</p>
        </div>
        <div className="profile-sidebar-footer">
          <button className="profile-footer-btn" onClick={handleLogout}>Log out</button>
          <button className="profile-footer-btn" onClick={() => navigate('/')}>Back</button>
        </div>
      </aside>

      <div className="profile-main">
        <div className="profile-banner">
          <div>
            <h1>Welcome, {displayName}</h1>
            <p>
              We are proud to have you join our community of learners, leaders,
              and achievers. We are committed to nurturing excellence, integrity,
              and innovation as you pursue your academic journey.
            </p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-top-bar">
            {!editing && (
              <button className="profile-edit-link" onClick={startEdit}>Edit info</button>
            )}
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <label className="profile-label">Student ID:</label>
              <input className="profile-input" type="text" value={user?.user_id || '--'} readOnly />
            </div>
            <div className="profile-field">
              <label className="profile-label">Full Name:</label>
              <input
                className={`profile-input ${editing ? 'editing' : ''}`}
                type="text"
                value={`${profile.first_name} ${profile.middle_name} ${profile.last_name}`.trim()}
                readOnly={!editing}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  setProfile({
                    ...profile,
                    first_name: parts[0] || '',
                    middle_name: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
                    last_name: parts.length > 1 ? parts[parts.length - 1] : '',
                  });
                }}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Year Level:</label>
              <input
                className={`profile-input ${editing ? 'editing' : ''}`}
                type="text"
                value={profile.year_level ? `${profile.year_level}` : '--'}
                readOnly={!editing}
                onChange={set('year_level')}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Gender:</label>
              <input
                className={`profile-input ${editing ? 'editing' : ''}`}
                type="text"
                value={profile.gender || '--'}
                readOnly={!editing}
                onChange={set('gender')}
              />
            </div>
            <div className="profile-field">
              <label className="profile-label">Email:</label>
              <input className="profile-input" type="text" value={profile.email} readOnly />
            </div>
            <div className="profile-field">
              <label className="profile-label">Contact:</label>
              <input
                className={`profile-input ${editing ? 'editing' : ''}`}
                type="text"
                value={profile.contact_no || '--'}
                readOnly={!editing}
                onChange={set('contact_no')}
              />
            </div>
            <div className="profile-field full">
              <label className="profile-label">Address:</label>
              <textarea
                className={`profile-textarea ${editing ? 'editing' : ''}`}
                value={profile.address || ''}
                readOnly={!editing}
                onChange={set('address')}
              />
            </div>
          </div>

          {editing && (
            <div className="profile-actions">
              <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
              <button className="btn-save" onClick={saveChanges}>Save Changes</button>
            </div>
          )}
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}
