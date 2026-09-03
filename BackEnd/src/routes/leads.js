const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getLeads,
  getLead,
  getLeadsByEmployee,
  createLead,
  updateLead,
  addNote,
  deleteLead,
} = require('../controllers/leadController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Lead routes
router.get('/', getLeads);
router.get('/:id', getLead);
router.get('/employee/:employeeId', getLeadsByEmployee);
router.post('/', createLead);
router.put('/:id', updateLead);
router.post('/:id/notes', addNote);
router.delete('/:id', checkRole(['admin', 'super_admin']), deleteLead);

module.exports = router;