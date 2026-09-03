const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getSettings,
  updateSettings,
  resetSettings,
} = require('../controllers/settingController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Settings routes (Admin only)
router.get('/', checkRole(['admin', 'super_admin']), getSettings);
router.put('/', checkRole(['admin', 'super_admin']), updateSettings);
router.post('/reset', checkRole(['admin', 'super_admin']), resetSettings);

module.exports = router;