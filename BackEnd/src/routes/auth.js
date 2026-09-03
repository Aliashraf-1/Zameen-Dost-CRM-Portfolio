const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  register, 
  login, 
  getMe, 
  logout, 
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');

// ✅ Public routes
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], login);

// ✅ Protected routes
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

// ✅ Admin only routes
router.post('/register', verifyToken, checkRole(['super_admin', 'admin']), [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
], register);

router.get('/users', verifyToken, checkRole(['super_admin', 'admin']), getAllUsers);
router.put('/users/:id', verifyToken, checkRole(['super_admin', 'admin']), updateUser);
router.delete('/users/:id', verifyToken, checkRole(['super_admin', 'admin']), deleteUser);

module.exports = router;