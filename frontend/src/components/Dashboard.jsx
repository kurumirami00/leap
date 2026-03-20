import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Student';

  return (
    <>
      <div className="banner">
        <div className="banner-body">
          <div className="banner-icon">L</div>
          <div>
            <h2>Welcome, {name}</h2>
            <p>Ready to learn something new today?</p>
          </div>
        </div>
        <div className="banner-decor">
          <span /><span /><span />
        </div>
      </div>

      <div className="task-grid">
        <div className="task-card orange">
          <span className="task-card-label">TO-DO TASK</span>
          <span className="task-card-count">--</span>
        </div>
        <div className="task-card slate">
          <span className="task-card-label">IN-PROGRESS TASK</span>
          <span className="task-card-count">--</span>
        </div>
        <div className="task-card purple">
          <span className="task-card-label">DEADLINES</span>
          <span className="task-card-count">--</span>
        </div>
        <div className="task-card orange">
          <span className="task-card-label">REMINDERS</span>
          <span className="task-card-count">--</span>
        </div>
      </div>
    </>
  );
}
