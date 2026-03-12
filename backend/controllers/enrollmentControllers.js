const pool = require('../config/database');

// Enroll a student into a course
const enrollStudent = async (req, res) => {
  const { student_id, course_id, early_enrolled } = req.body;
  if (!student_id || !course_id) return res.status(400).json({ error: 'student_id and course_id are required' });
  try {
    const [existing] = await pool.query(
      'SELECT 1 FROM Enrollment WHERE student_id = ? AND course_id = ?', [student_id, course_id]
    );
    if (existing.length > 0) return res.status(409).json({ error: 'Student already enrolled in this course' });

    const [result] = await pool.query(
      'INSERT INTO Enrollment (student_id, course_id, early_enrolled) VALUES (?, ?, ?)',
      [student_id, course_id, early_enrolled ? 1 : 0]
    );
    res.status(201).json({ message: 'Enrolled successfully', enrollment_id: result.insertId });
  } catch (err) {
    console.error('Enroll error:', err.message);
    res.status(500).json({ error: 'Enrollment failed', details: err.message });
  }
};

// Get all enrollments for a student
const getStudentEnrollments = async (req, res) => {
  const { student_id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.course_name, c.course_code, c.description, c.status AS course_status
      FROM Enrollment e
      JOIN Course c ON c.course_id = e.course_id
      WHERE e.student_id = ?
    `, [student_id]);
    res.json(rows);
  } catch (err) {
    console.error('Get enrollments error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all enrollments for a course
const getCourseEnrollments = async (req, res) => {
  const { course_id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT e.*, s.first_name, s.last_name, u.email
      FROM Enrollment e
      JOIN Student s ON s.student_id = e.student_id
      JOIN \`User\` u ON u.user_id = s.user_id
      WHERE e.course_id = ?
    `, [course_id]);
    res.json(rows);
  } catch (err) {
    console.error('Get course enrollments error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unenroll
const unenrollStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Enrollment WHERE enrollment_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Enrollment not found' });
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    console.error('Unenroll error:', err.message);
    res.status(500).json({ error: 'Unenroll failed' });
  }
};

module.exports = { enrollStudent, getStudentEnrollments, getCourseEnrollments, unenrollStudent };
