const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    default: '',
  },
  customerCNIC: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['Hostel', 'Office', 'Shop', 'Room', 'Desk', 'Other'],
    default: 'Room',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'],
    default: 'New',
  },
  source: {
    type: String,
    enum: ['Referral', 'Website', 'Walk-in', 'Social Media', 'Phone', 'Other'],
    default: 'Referral',
  },
  remarks: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  assignedToName: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  followUpDate: {
    type: String,
    default: null,
  },
  convertedToUnit: {
    type: String,
    default: null,
  },
  notes: [{
    text: { type: String, default: '' },
    createdAt: { type: String, default: '' },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      default: null,
    },
    createdByName: { type: String, default: '' },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);