const express = require('express');
const router = express.Router();
const { enrollStudent, getStudentEnrollments, getCourseEnrollments, unenrollStudent } = require('../controllers/enrollmentControllers');
const { verifyToken } = require('../middleware/authMiddlewares');

router.post('/',                         verifyToken, enrollStudent);
router.get('/student/:student_id',       verifyToken, getStudentEnrollments);
router.get('/course/:course_id',         verifyToken, getCourseEnrollments);
router.delete('/:id',                    verifyToken, unenrollStudent);

module.exports = router;
