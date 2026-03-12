import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'https://leap-backend-6ttf.onrender.com';

const Dashboard = () => {
  const { token, user: currentUser, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/users`, authHeaders);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/api/users/${editingUser.user_id}`, editingUser, authHeaders);
      alert('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API}/api/users/${userId}`, authHeaders);
      fetchUsers();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  const roleStyle = (role) => ({
    background: role === 'instructor'
      ? 'linear-gradient(135deg, #f093fb, #f5576c)'
      : 'linear-gradient(135deg, #4CAF50, #45a049)',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  });

  return (
    <div className="dashboard-page-bg">
      <div className="dashboard-glass-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2>User Administration</h2>
            <p style={{ color: '#718096', margin: '8px 0 0 0', fontSize: '14px' }}>
              Logged in as <strong>{currentUser?.email}</strong>
              {currentUser?.role && <> &middot; <span style={{ textTransform: 'capitalize' }}>{currentUser.role}</span></>}
            </p>
          </div>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>

        {editingUser && (
          <div className="edit-form-container">
            <h3>Edit User #{editingUser.user_id}</h3>
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input className="app-input" type="text" placeholder="First Name" value={editingUser.first_name || ''} onChange={e => setEditingUser({ ...editingUser, first_name: e.target.value })} />
                <input className="app-input" type="text" placeholder="Last Name" value={editingUser.last_name || ''} onChange={e => setEditingUser({ ...editingUser, last_name: e.target.value })} />
              </div>
              <input className="app-input" type="text" placeholder="Middle Name" value={editingUser.middle_name || ''} onChange={e => setEditingUser({ ...editingUser, middle_name: e.target.value })} />
              <input className="app-input" type="email" placeholder="Email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} required
                pattern=".*(@gbox\.ncf\.edu\.ph|@ncf\.edu\.ph)$" />
              {editingUser.role === 'student' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input className="app-input" type="number" placeholder="Year Level" value={editingUser.year_level || ''} onChange={e => setEditingUser({ ...editingUser, year_level: e.target.value })} min="1" max="5" />
                  <input className="app-input" type="number" placeholder="Dept ID" value={editingUser.dept_id || ''} onChange={e => setEditingUser({ ...editingUser, dept_id: e.target.value })} />
                </div>
              )}
              {editingUser.role === 'instructor' && (
                <>
                  <input className="app-input" type="text" placeholder="Specialization" value={editingUser.specialization || ''} onChange={e => setEditingUser({ ...editingUser, specialization: e.target.value })} />
                  <input className="app-input" type="text" placeholder="Contact No" value={editingUser.contact_no || ''} onChange={e => setEditingUser({ ...editingUser, contact_no: e.target.value })} />
                </>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="app-button" style={{ margin: 0, width: 'auto' }}>Save Changes</button>
                <button type="button" onClick={() => setEditingUser(null)} className="app-button" style={{ margin: 0, width: 'auto', background: 'linear-gradient(135deg, #718096, #4a5568)' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div className="loading"></div>
            <p style={{ marginTop: '20px', color: '#718096' }}>Loading users...</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(34,197,94,0.08)', padding: '20px', borderRadius: '16px', marginBottom: '30px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Users', value: users.length, color: '#2d3748' },
                { label: 'Students', value: users.filter(u => u.role === 'student').length, color: '#4CAF50' },
                { label: 'Instructors', value: users.filter(u => u.role === 'instructor').length, color: '#f5576c' }
              ].map(s => (
                <div key={s.label}>
                  <p style={{ margin: 0, color: '#718096', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</p>
                  <p style={{ margin: '5px 0 0 0', color: s.color, fontSize: '28px', fontWeight: '700' }}>{s.value}</p>
                </div>
              ))}
            </div>

            <table className="user-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Details</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>No users found</td></tr>
                ) : users.map(u => (
                  <tr key={u.user_id}>
                    <td>
                      <span style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                        {u.user_id}
                      </span>
                    </td>
                    <td><strong>{u.first_name} {u.last_name}</strong></td>
                    <td>{u.email}</td>
                    <td><span style={roleStyle(u.role)}>{u.role}</span></td>
                    <td style={{ fontSize: '13px', color: '#718096' }}>
                      {u.role === 'student' && <>Year {u.year_level || '-'} &middot; Dept {u.dept_id || '-'}</>}
                      {u.role === 'instructor' && <>{u.specialization || '-'}</>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => setEditingUser(u)}>Edit</button>
                      <button onClick={() => handleDelete(u.user_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;