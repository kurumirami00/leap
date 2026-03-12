const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || '12h' }
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// Creates a User row + a Student or Instructor profile row in one transaction.
const register = async (req, res) => {
  const {
    email, password,
    first_name, middle_name, last_name,
    gender, address, year_level, dept_id,   // student fields
    age, birth_date, contact_no,              // instructor fields
    specialization, hire_date,                // instructor fields
    role                                      // 'student' | 'instructor'
  } = req.body;

  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ error: 'Missing required fields: email, password, first_name, last_name, role' });
  }

  if (!['student', 'instructor'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "student" or "instructor"' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Check email uniqueness
    const [existing] = await conn.query('SELECT 1 FROM `User` WHERE email = ?', [email]);
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // 3. Insert into User table (password stored in a separate passwords table concept —
    //    here we store the hash in is_staff as a placeholder is NOT suitable, so we add
    //    a password_hash column logic by using a companion approach: store via a secure field)
    //    NOTE: The LEAP schema doesn't have password_hash on User. Best practice is to add it.
    //    We insert into User and store the hash. The migration script below handles the column.
    const [userResult] = await conn.query(
      `INSERT INTO \`User\` (date_joined, email, avatar_url, is_active, is_staff, is_superuser)
       VALUES (CURDATE(), ?, NULL, 1, 0, 0)`,
      [email]
    );
    const user_id = userResult.insertId;

    // 4. Store password hash in User_Auth table
    await conn.query(
      `INSERT INTO User_Auth (user_id, password_hash) VALUES (?, ?)`,
      [user_id, password_hash]
    );

    // 5. Insert role-specific profile
    if (role === 'student') {
      await conn.query(
        `INSERT INTO Student (user_id, first_name, middle_name, last_name, gender, address, year_level, dept_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, first_name, middle_name || null, last_name, gender || null, address || null, year_level || null, dept_id || null]
      );
    } else {
      await conn.query(
        `INSERT INTO Instructor (user_id, first_name, middle_name, last_name, age, birth_date, gender, address, contact_no, specialization, hire_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [user_id, first_name, middle_name || null, last_name, age || null, birth_date || null, gender || null, address || null, contact_no || null, specialization || null, hire_date || null]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Account created successfully!',
      user: { user_id, email, role }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  } finally {
    conn.release();
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Find user
    const [users] = await pool.query(
      `SELECT u.user_id, u.email, u.is_active, ua.password_hash
       FROM \`User\` u
       JOIN User_Auth ua ON u.user_id = ua.user_id
       WHERE u.email = ?`,
      [email]
    );

    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // 2. Determine role (student or instructor)
    const [studentRows] = await pool.query(
      `SELECT student_id, first_name, last_name FROM Student WHERE user_id = ?`, [user.user_id]
    );
    const [instructorRows] = await pool.query(
      `SELECT instructor_id, first_name, last_name FROM Instructor WHERE user_id = ?`, [user.user_id]
    );

    let role = 'unknown';
    let profile = {};
    if (studentRows.length > 0) {
      role = 'student';
      profile = { profile_id: studentRows[0].student_id, first_name: studentRows[0].first_name, last_name: studentRows[0].last_name };
    } else if (instructorRows.length > 0) {
      role = 'instructor';
      profile = { profile_id: instructorRows[0].instructor_id, first_name: instructorRows[0].first_name, last_name: instructorRows[0].last_name };
    }

    // 3. Update last_login
    pool.query('UPDATE `User` SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

    const tokenPayload = { user_id: user.user_id, email: user.email, role };
    const token = generateToken(tokenPayload);

    res.json({
      token,
      user: { user_id: user.user_id, email: user.email, role, ...profile }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
