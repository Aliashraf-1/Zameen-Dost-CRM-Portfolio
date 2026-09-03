const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getProfitLossReport,
  getGeneralReport,
  getEmployeePerformanceReport,
  exportAllReports,
} = require('../controllers/reportsController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Report routes (Admin, Moderator, Super Admin)
router.get('/profit-loss', checkRole(['admin', 'moderator', 'super_admin']), getProfitLossReport);
router.get('/general', checkRole(['admin', 'moderator', 'super_admin']), getGeneralReport);
router.get('/employee-performance', checkRole(['admin', 'moderator', 'super_admin']), getEmployeePerformanceReport);
router.post('/export-all', checkRole(['admin', 'super_admin']), exportAllReports);

module.exports = router;