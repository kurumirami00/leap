const express = require('express');
const router = express.Router();
const { getStudentGrades, upsertGrade } = require('../controllers/gradeControllers');
const { getAllBadges, getStudentBadges, awardBadge } = require('../controllers/badgeControllers');
const { verifyToken } = require('../middleware/authMiddlewares');

// Grades
router.get('/student/:student_id', verifyToken, getStudentGrades);
router.post('/',                   verifyToken, upsertGrade);

module.exports = router;
