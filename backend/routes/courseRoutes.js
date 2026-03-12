const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseControllers');
const { verifyToken } = require('../middleware/authMiddlewares');

router.get('/',       verifyToken, getAllCourses);
router.get('/:id',    verifyToken, getCourseById);
router.post('/',      verifyToken, createCourse);
router.put('/:id',    verifyToken, updateCourse);
router.delete('/:id', verifyToken, deleteCourse);

module.exports = router;
