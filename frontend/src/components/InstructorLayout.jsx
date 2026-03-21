import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { to: '/instructor/lessons',    label: 'MY LESSONS',      icon: 'LS' },
  { to: '/instructor/create',     label: 'CREATE LESSONS',  icon: 'CR' },
  { to: '/instructor/assignments',label: 'ASSIGNMENTS',     icon: 'AS' },
  { to: '/instructor/calendar',   label: 'CALENDAR',        icon: 'CA' },
  { to: '/instructor/profile',    label: 'PROFILE',         icon: 'PR' },
];

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function InstructorLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    if (window.confirm('Log out?')) {
      logout();
      navigate('/login');
    }
  }

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'Instructor';

  const initials = user
    ? `${(user.first_name || '?')[0]}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : '?';

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-name">Hi, {displayName}</div>
            <NavLink to="/instructor/profile" className="sidebar-profile-link">View profile</NavLink>
          </div>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>Log out</button>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <div className="search-bar">
          <SearchIcon />
          <input type="text" placeholder="Search Lessons / Students" />
        </div>
        <Outlet />
      </main>
    </div>
  );
}