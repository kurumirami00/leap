import { useEffect, useState } from 'react';
import api from '../api';

export default function MyLessons() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/courses')
      .then((res) => setCourses(res.data))
      .catch(() => setError('Failed to load lessons.'))
      .finally(() => setLoading(false));
  }, []);

  const archived = courses.filter((c) => c.status === 'archived').length;
  const active   = courses.filter((c) => c.status === 'active').length;
  const draft    = courses.filter((c) => !c.status || c.status === 'draft').length;

  return (
    <div className="content-container">
      <h2>My Lessons</h2>

      {loading && <p>Loading...</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="lesson-status">
            <p>ARCHIVED: {archived}</p>
            <p>ACTIVE: {active}</p>
            <p>DRAFT: {draft}</p>
          </div>

          {courses.length === 0 ? (
            <p>No lessons yet. Create your first lesson!</p>
          ) : (
            <ul className="lesson-list">
              {courses.map((c, i) => (
                <li key={c.course_id}>
                  {String(i + 1).padStart(2, '0')}. {c.course_name}
                  {c.course_code ? ` (${c.course_code})` : ''}
                  {' — '}
                  {c.lesson_count || 0} modules
                  {' — '}
                  {c.enrolled_count || 0} students
                  <span style={{
                    marginLeft: 8,
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: c.status === 'active' ? '#e8f5e9' : '#f5f5f5',
                    color: c.status === 'active' ? '#2e7d32' : '#888',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {c.status || 'draft'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}