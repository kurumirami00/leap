const pool = require('../config/database');

// Get grades for a student
const getStudentGrades = async (req, res) => {
  const { student_id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT g.*, c.course_name, c.course_code
      FROM Grade g
      JOIN Course c ON c.course_id = g.course_id
      WHERE g.student_id = ?
      ORDER BY g.date_awarded DESC
    `, [student_id]);
    res.json(rows);
  } catch (err) {
    console.error('Get grades error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Award / upsert a grade
const upsertGrade = async (req, res) => {
  const { student_id, course_id, grade_value } = req.body;
  if (!student_id || !course_id || grade_value === undefined) {
    return res.status(400).json({ error: 'student_id, course_id, and grade_value are required' });
  }
  try {
    const [existing] = await pool.query(
      'SELECT grade_id FROM Grade WHERE student_id = ? AND course_id = ?', [student_id, course_id]
    );
    if (existing.length > 0) {
      await pool.query(
        'UPDATE Grade SET grade_value = ?, date_awarded = CURDATE() WHERE grade_id = ?',
        [grade_value, existing[0].grade_id]
      );
      res.json({ message: 'Grade updated', grade_id: existing[0].grade_id });
    } else {
      const [result] = await pool.query(
        'INSERT INTO Grade (student_id, course_id, grade_value, date_awarded) VALUES (?, ?, ?, CURDATE())',
        [student_id, course_id, grade_value]
      );
      res.status(201).json({ message: 'Grade awarded', grade_id: result.insertId });
    }
  } catch (err) {
    console.error('Upsert grade error:', err.message);
    res.status(500).json({ error: 'Grade operation failed', details: err.message });
  }
};

module.exports = { getStudentGrades, upsertGrade };
