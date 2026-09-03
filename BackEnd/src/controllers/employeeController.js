const Employee = require('../models/Employee');

// ✅ Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get single employee
exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Create employee
exports.createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const employee = await Employee.create(employeeData);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employee = await Employee.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully.',
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendanceData = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    employee.attendance.push(attendanceData);
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add task
exports.addTask = async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    employee.tasks.push(taskData);
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update task
exports.updateTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const updates = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const task = employee.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    Object.keys(updates).forEach(key => {
      task[key] = updates[key];
    });

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Pay salary
exports.paySalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month, deductions } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const salaryRecord = {
      month: month || new Date().toISOString().slice(0, 7),
      amount: amount || employee.salary,
      status: amount >= employee.salary ? 'Paid' : 'Partial',
      paidAt: new Date().toISOString(),
      remarks: 'Salary payment',
      deductions: deductions || { leaves: 0, late: 0, taskFailure: 0, total: 0 },
    };

    employee.salaryHistory.push(salaryRecord);
    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Salary paid successfully.',
      data: employee,
    });
  } catch (error) {
    console.error('Pay salary error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};