import { useState } from 'react';
import api from '../api';

export default function CreateLessons() {
  const [form, setForm] = useState({
    course_name: '',
    course_code: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  function set(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.course_name.trim()) {
      setError('Course name is required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/courses', form);
      setSuccess('Lesson created successfully!');
      setForm({ course_name: '', course_code: '', description: '', status: 'active' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create lesson.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-container">
      <h2>Create Lesson</h2>
      <p>Fill in the details to create a new lesson/course for your students.</p>

      {success && <p style={{ color: '#2e7d32', fontWeight: 700 }}>✓ {success}</p>}
      {error   && <p style={{ color: '#e03a3a', fontWeight: 700 }}>✗ {error}</p>}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Lesson / Course Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Introduction to Software Engineering"
          value={form.course_name}
          onChange={set('course_name')}
          disabled={loading}
          required
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Course Code
        </label>
        <input
          type="text"
          placeholder="e.g. CS101"
          value={form.course_code}
          onChange={set('course_code')}
          disabled={loading}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Description
        </label>
        <textarea
          placeholder="Brief description of this lesson..."
          value={form.description}
          onChange={set('description')}
          disabled={loading}
        />

        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
          Status
        </label>
        <select
          value={form.status}
          onChange={set('status')}
          disabled={loading}
          style={{ width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 16, boxSizing: 'border-box' }}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Lesson'}
        </button>
      </form>
    </div>
  );
}