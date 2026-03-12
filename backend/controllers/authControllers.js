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

const register = async (req, res) => {
  const {
    email,
    password,
    first_name,
    middle_name,
    last_name,
    gender,
    address,
    year_level,
    dept_id,
    age,
    birth_date,
    contact_no,
    specialization,
    hire_date,
    role
  } = req.body;

  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['student', 'instructor'].includes(role)) {
    return res.status(400).json({ error: 'Role must be student or instructor' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query('SELECT 1 FROM `User` WHERE email = ?', [email]);
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const [userResult] = await conn.query(
      'INSERT INTO `User` (date_joined, email, avatar_url, is_active, is_staff, is_superuser) VALUES (CURDATE(), ?, NULL, 1, 0, 0)',
      [email]
    );
    const user_id = userResult.insertId;

    await conn.query(
      'INSERT INTO User_Auth (user_id, password_hash) VALUES (?, ?)',
      [user_id, password_hash]
    );

    if (role === 'student') {
      await conn.query(
        'INSERT INTO Student (user_id, first_name, middle_name, last_name, gender, address, year_level, dept_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, first_name, middle_name || null, last_name, gender || null, address || null, year_level || null, dept_id || null]
      );
    } else {
      await conn.query(
        'INSERT INTO Instructor (user_id, first_name, middle_name, last_name, age, birth_date, gender, address, contact_no, specialization, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, first_name, middle_name || null, last_name, age || null, birth_date || null, gender || null, address || null, contact_no || null, specialization || null, hire_date || null, 'active']
      );
    }

    await conn.commit();

    res.status(201).json({
      message: 'Account created successfully',
      user: { user_id, email, role }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [users] = await pool.query(
      'SELECT u.user_id, u.email, u.is_active, ua.password_hash FROM `User` u JOIN User_Auth ua ON u.user_id = ua.user_id WHERE u.email = ?',
      [email]
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const [studentRows] = await pool.query(
      'SELECT student_id, first_name, last_name FROM Student WHERE user_id = ?',
      [user.user_id]
    );
    const [instructorRows] = await pool.query(
      'SELECT instructor_id, first_name, last_name FROM Instructor WHERE user_id = ?',
      [user.user_id]
    );

    let role = 'unknown';
    let profile = {};

    if (studentRows.length > 0) {
      role = 'student';
      profile = {
        profile_id: studentRows[0].student_id,
        first_name: studentRows[0].first_name,
        last_name: studentRows[0].last_name
      };
    } else if (instructorRows.length > 0) {
      role = 'instructor';
      profile = {
        profile_id: instructorRows[0].instructor_id,
        first_name: instructorRows[0].first_name,
        last_name: instructorRows[0].last_name
      };
    }

    pool.query('UPDATE `User` SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

    const token = generateToken({ user_id: user.user_id, email: user.email, role });

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