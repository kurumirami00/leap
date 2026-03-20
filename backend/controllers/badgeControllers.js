const pool = require('../config/database');

// Get all badges
const getAllBadges = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, bc.condition_type, bc.required_score
      FROM Badge b
      LEFT JOIN BadgeCondition bc ON bc.badge_id = b.badge_id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get badges error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get badges for a student
const getStudentBadges = async (req, res) => {
  const { student_id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT sb.student_badge_id, sb.date_earned, b.badge_id, b.badge_name, b.description
      FROM Student_Badge sb
      JOIN Badge b ON b.badge_id = sb.badge_id
      WHERE sb.student_id = ?
      ORDER BY sb.date_earned DESC
    `, [student_id]);
    res.json(rows);
  } catch (err) {
    console.error('Get student badges error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Award a badge to a student
const awardBadge = async (req, res) => {
  const { student_id, badge_id } = req.body;
  if (!student_id || !badge_id) return res.status(400).json({ error: 'student_id and badge_id are required' });
  try {
    const [existing] = await pool.query(
      'SELECT 1 FROM Student_Badge WHERE student_id = ? AND badge_id = ?', [student_id, badge_id]
    );
    if (existing.length > 0) return res.status(409).json({ error: 'Badge already awarded to this student' });
    const [result] = await pool.query(
      'INSERT INTO Student_Badge (student_id, badge_id) VALUES (?, ?)', [student_id, badge_id]
    );
    res.status(201).json({ message: 'Badge awarded', student_badge_id: result.insertId });
  } catch (err) {
    console.error('Award badge error:', err.message);
    res.status(500).json({ error: 'Badge award failed', details: err.message });
  }
};

module.exports = { getAllBadges, getStudentBadges, awardBadge };
