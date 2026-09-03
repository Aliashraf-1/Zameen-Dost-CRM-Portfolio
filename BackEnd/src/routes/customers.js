const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addRentPayment,
  addSecurityTransaction,
  addDocument,
  updateDocument,
  deleteDocument,
  addNote,
  getCustomersByStatus,
  getCustomerByUnit,
} = require('../controllers/customerController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Customer CRUD
router.get('/', getCustomers);
router.get('/status/:status', getCustomersByStatus);
router.get('/unit/:unitId', getCustomerByUnit);
router.get('/:id', getCustomer);
router.post('/', checkRole(['admin', 'super_admin']), createCustomer);
router.put('/:id', checkRole(['admin', 'super_admin']), updateCustomer);
router.delete('/:id', checkRole(['admin', 'super_admin']), deleteCustomer);

// ✅ Rent & Security
router.post('/:id/rent-payment', addRentPayment);
router.post('/:id/security-transaction', addSecurityTransaction);

// ✅ Documents
router.post('/:id/documents', addDocument);
router.put('/:id/documents/:docId', updateDocument);
router.delete('/:id/documents/:docId', deleteDocument);

// ✅ Notes
router.post('/:id/notes', addNote);

module.exports = router;