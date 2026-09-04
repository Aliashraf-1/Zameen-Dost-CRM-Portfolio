const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active',
  },
  image: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: '',
  },
  emergencyContact: {
    type: String,
    default: '',
  },
  emergencyName: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['admin', 'lead_manager', 'moderator', 'employee'],
    default: 'employee',
  },
  canManageLeads: {
    type: Boolean,
    default: false,
  },
  hasLogin: {
    type: Boolean,
    default: false,
  },
  shiftTiming: {
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '17:00' },
    graceMinutes: { type: Number, default: 30 },
    weeklyOff: { type: String, default: 'Friday' },
    monthlyLeaves: { type: Number, default: 1 },
  },
  attendanceSettings: {
    dailyWage: { type: Number, default: 0 },
    leaveDeduction: { type: Number, default: 500 },
    lateDeduction: { type: Number, default: 10 },
    taskFailureDeduction: { type: Number, default: 1000 },
  },
    attendance: [{
      date: { type: String },
      status: { 
        type: String, 
        enum: ['Present', 'Absent', 'Leave', 'Friday Off'],
        default: 'Present'
      },
      checkIn: { type: String, default: null },
      checkOut: { type: String, default: null },
      lateMinutes: { type: Number, default: 0 },
      chargeableLateMinutes: { type: Number, default: 0 }, // ✅ Added
      lateDeductionAmount: { type: Number, default: 0 }, // ✅ Added
      leaveDeductionAmount: { type: Number, default: 0 }, // ✅ Added
    }],
  tasks: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    assignedDate: { type: String },
    dueDate: { type: String },
    status: { 
      type: String, 
      enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
      default: 'Pending'
    },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    completedAt: { type: String, default: null },
    remarks: { type: String, default: '' },
    failureReason: { type: String, default: '' },
    failureDeduction: { type: Number, default: 0 },
  }],
  leads: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Lead',
}],

  salaryHistory: [{
    month: { type: String },
    amount: { type: Number },
    status: { 
      type: String, 
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending'
    },
    paidAt: { type: String, default: null },
    remarks: { type: String, default: '' },
    deductions: {
      leaves: { type: Number, default: 0 },
      late: { type: Number, default: 0 },
      taskFailure: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Employee', employeeSchema);