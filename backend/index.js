require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes       = require('./routes/authRoutes');
const userRoutes       = require('./routes/userRoutes');
const courseRoutes     = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const gradeRoutes      = require('./routes/gradeRoutes');
const badgeRoutes      = require('./routes/badgeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/courses',     courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/grades',      gradeRoutes);
app.use('/api/badges',      badgeRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.get('/', (req, res) => res.json({ message: '🚀 LEAP API is running' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 LEAP server running on port ${PORT}`));