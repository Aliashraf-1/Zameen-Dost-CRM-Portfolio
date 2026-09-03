const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  markAttendance,
  addTask,
  updateTask,
  paySalary,
} = require('../controllers/employeeController');

// ✅ All routes protected
router.use(verifyToken);

// ✅ Employee CRUD
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', checkRole(['admin', 'super_admin']), createEmployee);
router.put('/:id', checkRole(['admin', 'super_admin']), updateEmployee);
router.delete('/:id', checkRole(['admin', 'super_admin']), deleteEmployee);

// ✅ Attendance
router.post('/:id/attendance', markAttendance);

// ✅ Tasks
router.post('/:id/tasks', addTask);
router.put('/:id/tasks/:taskId', updateTask);

// ✅ Salary
router.post('/:id/salary', checkRole(['admin', 'super_admin']), paySalary);

module.exports = router;