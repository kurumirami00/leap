const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userControllers');
const { verifyToken } = require('../middleware/authMiddlewares');

router.get('/',       verifyToken, getAllUsers);
router.get('/:id',    verifyToken, getUserById);
router.put('/:id',    verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
