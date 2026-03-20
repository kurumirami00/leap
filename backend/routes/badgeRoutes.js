const express = require('express');
const router = express.Router();
const { getAllBadges, getStudentBadges, awardBadge } = require('../controllers/badgeControllers');
const { verifyToken } = require('../middleware/authMiddlewares');

router.get('/',                        verifyToken, getAllBadges);
router.get('/student/:student_id',     verifyToken, getStudentBadges);
router.post('/award',                  verifyToken, awardBadge);

module.exports = router;
