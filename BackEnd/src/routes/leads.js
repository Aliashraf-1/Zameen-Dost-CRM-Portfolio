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

// All authenticated roles can view leads (including employee).
// Create/update ownership is enforced in the controller.
router.use(verifyToken);

router.get('/', getLeads);
router.get('/employee/:employeeId', getLeadsByEmployee);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.post('/:id/notes', addNote);
router.delete('/:id', checkRole(['admin', 'super_admin']), deleteLead);

module.exports = router;