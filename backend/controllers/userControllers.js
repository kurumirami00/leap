const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// ─── GET ALL USERS (with role profile joined) ─────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        u.user_id,
        u.email,
        u.date_joined,
        u.is_active,
        u.last_login,
        COALESCE(s.first_name, i.first_name)   AS first_name,
        COALESCE(s.last_name,  i.last_name)    AS last_name,
        CASE
          WHEN s.student_id    IS NOT NULL THEN 'student'
          WHEN i.instructor_id IS NOT NULL THEN 'instructor'
          ELSE 'unknown'
        END AS role,
        s.student_id,
        s.year_level,
        s.dept_id,
        i.instructor_id,
        i.specialization
      FROM \`User\` u
      LEFT JOIN Student    s ON s.user_id = u.user_id
      LEFT JOIN Instructor i ON i.user_id = u.user_id
      ORDER BY u.user_id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Get all users error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── GET USER BY ID ───────────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT
        u.user_id, u.email, u.date_joined, u.is_active, u.last_login, u.avatar_url,
        COALESCE(s.first_name, i.first_name)    AS first_name,
        COALESCE(s.middle_name, i.middle_name)  AS middle_name,
        COALESCE(s.last_name,  i.last_name)     AS last_name,
        COALESCE(s.gender,     i.gender)        AS gender,
        COALESCE(s.address,    i.address)       AS address,
        CASE
          WHEN s.student_id    IS NOT NULL THEN 'student'
          WHEN i.instructor_id IS NOT NULL THEN 'instructor'
          ELSE 'unknown'
        END AS role,
        s.student_id, s.year_level, s.dept_id,
        i.instructor_id, i.specialization, i.contact_no, i.hire_date, i.status AS instructor_status
      FROM \`User\` u
      LEFT JOIN Student    s ON s.user_id = u.user_id
      LEFT JOIN Instructor i ON i.user_id = u.user_id
      WHERE u.user_id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get user by ID error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── UPDATE USER ──────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, first_name, middle_name, last_name, gender, address, year_level, dept_id, specialization, contact_no, is_active } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Update User table
    const userFields = [];
    const userValues = [];
    if (email      !== undefined) { userFields.push('email = ?');     userValues.push(email); }
    if (is_active  !== undefined) { userFields.push('is_active = ?'); userValues.push(is_active); }
    if (userFields.length > 0) {
      userValues.push(id);
      await conn.query(`UPDATE \`User\` SET ${userFields.join(', ')} WHERE user_id = ?`, userValues);
    }

    // Update password if provided
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      await conn.query('UPDATE User_Auth SET password_hash = ? WHERE user_id = ?', [hash, id]);
    }

    // Determine role
    const [studentRows]    = await conn.query('SELECT student_id FROM Student WHERE user_id = ?', [id]);
    const [instructorRows] = await conn.query('SELECT instructor_id FROM Instructor WHERE user_id = ?', [id]);

    if (studentRows.length > 0) {
      const sFields = [];
      const sValues = [];
      if (first_name  !== undefined) { sFields.push('first_name = ?');  sValues.push(first_name); }
      if (middle_name !== undefined) { sFields.push('middle_name = ?'); sValues.push(middle_name); }
      if (last_name   !== undefined) { sFields.push('last_name = ?');   sValues.push(last_name); }
      if (gender      !== undefined) { sFields.push('gender = ?');      sValues.push(gender); }
      if (address     !== undefined) { sFields.push('address = ?');     sValues.push(address); }
      if (year_level  !== undefined) { sFields.push('year_level = ?');  sValues.push(year_level); }
      if (dept_id     !== undefined) { sFields.push('dept_id = ?');     sValues.push(dept_id); }
      if (sFields.length > 0) {
        sValues.push(id);
        await conn.query(`UPDATE Student SET ${sFields.join(', ')} WHERE user_id = ?`, sValues);
      }
    } else if (instructorRows.length > 0) {
      const iFields = [];
      const iValues = [];
      if (first_name    !== undefined) { iFields.push('first_name = ?');    iValues.push(first_name); }
      if (middle_name   !== undefined) { iFields.push('middle_name = ?');   iValues.push(middle_name); }
      if (last_name     !== undefined) { iFields.push('last_name = ?');     iValues.push(last_name); }
      if (gender        !== undefined) { iFields.push('gender = ?');        iValues.push(gender); }
      if (address       !== undefined) { iFields.push('address = ?');       iValues.push(address); }
      if (specialization!== undefined) { iFields.push('specialization = ?');iValues.push(specialization); }
      if (contact_no    !== undefined) { iFields.push('contact_no = ?');    iValues.push(contact_no); }
      if (iFields.length > 0) {
        iValues.push(id);
        await conn.query(`UPDATE Instructor SET ${iFields.join(', ')} WHERE user_id = ?`, iValues);
      }
    }

    await conn.commit();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Update failed', details: err.message });
  } finally {
    conn.release();
  }
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM `User` WHERE user_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
