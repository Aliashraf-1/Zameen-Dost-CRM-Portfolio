const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getDashboardStats,
  getRevenueChart,
  getRecentLeads,
} = require('../controllers/dashboardController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/recent-leads', getRecentLeads);

module.exports = router;