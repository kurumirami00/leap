import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function InstructorDashboard() {
  const { user } = useContext(AuthContext);
  const name = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Instructor';

  const [stats, setStats] = useState({
    totalCourses: '--',
    totalStudents: '--',
    pendingGrades: '--',
    totalLessons: '--',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/courses');
        const courses = res.data;

        const totalCourses = courses.length;
        const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled_count || 0), 0);
        const totalLessons = courses.reduce((sum, c) => sum + (c.lesson_count || 0), 0);

        setStats({
          totalCourses,
          totalStudents,
          totalLessons,
          pendingGrades: '--', // no endpoint for pending grades yet
        });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <div className="banner">
        <div className="banner-body">
          <div className="banner-icon">L</div>
          <div>
            <h2>Welcome Tigers!</h2>
            <p>Hi, Prof. {name} — manage your lessons and track student progress.</p>
          </div>
        </div>
        <div className="banner-decor">
          <span /><span /><span />
        </div>
      </div>

      <div className="task-grid">
        <div className="task-card lessons">
          <span className="task-card-label">MY COURSES</span>
          <span className="task-card-count">{loading ? '...' : stats.totalCourses}</span>
        </div>
        <div className="task-card students">
          <span className="task-card-label">ENROLLED STUDENTS</span>
          <span className="task-card-count">{loading ? '...' : stats.totalStudents}</span>
        </div>
        <div className="task-card slate">
          <span className="task-card-label">TOTAL LESSONS</span>
          <span className="task-card-count">{loading ? '...' : stats.totalLessons}</span>
        </div>
        <div className="task-card pending">
          <span className="task-card-label">PENDING GRADES</span>
          <span className="task-card-count">{stats.pendingGrades}</span>
        </div>
      </div>
    </>
  );
}