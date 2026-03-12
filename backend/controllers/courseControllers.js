const pool = require('../config/database');

// GET all courses
const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*,
        COUNT(DISTINCT e.enrollment_id) AS enrolled_count,
        COUNT(DISTINCT l.lesson_id)     AS lesson_count
      FROM Course c
      LEFT JOIN Enrollment e ON e.course_id = c.course_id
      LEFT JOIN Lesson     l ON l.course_id = c.course_id
      GROUP BY c.course_id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get courses error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET course by ID (with lessons)
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[course]] = await pool.query('SELECT * FROM Course WHERE course_id = ?', [id]);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const [lessons] = await pool.query(
      'SELECT * FROM Lesson WHERE course_id = ? ORDER BY section_order, lesson_order', [id]
    );
    res.json({ ...course, lessons });
  } catch (err) {
    console.error('Get course by ID error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE course
const createCourse = async (req, res) => {
  const { course_name, course_code, description, status } = req.body;
  if (!course_name) return res.status(400).json({ error: 'course_name is required' });
  try {
    const [result] = await pool.query(
      `INSERT INTO Course (course_name, course_code, description, is_published, status)
       VALUES (?, ?, ?, 0, ?)`,
      [course_name, course_code || null, description || null, status || 'active']
    );
    res.status(201).json({ message: 'Course created', course_id: result.insertId });
  } catch (err) {
    console.error('Create course error:', err.message);
    res.status(500).json({ error: 'Could not create course', details: err.message });
  }
};

// UPDATE course
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_name, course_code, description, is_published, status } = req.body;
  try {
    const fields = [];
    const values = [];
    if (course_name  !== undefined) { fields.push('course_name = ?');  values.push(course_name); }
    if (course_code  !== undefined) { fields.push('course_code = ?');  values.push(course_code); }
    if (description  !== undefined) { fields.push('description = ?');  values.push(description); }
    if (is_published !== undefined) { fields.push('is_published = ?'); values.push(is_published); }
    if (status       !== undefined) { fields.push('status = ?');       values.push(status); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    await pool.query(`UPDATE Course SET ${fields.join(', ')} WHERE course_id = ?`, values);
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('Update course error:', err.message);
    res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE course
const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM Course WHERE course_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('Delete course error:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
