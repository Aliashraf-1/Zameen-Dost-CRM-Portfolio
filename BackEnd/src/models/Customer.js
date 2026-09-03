const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // ✅ Personal Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  reference: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: null,
  },
  
  // ✅ Father/Husband Name
  fatherName: {
    type: String,
    default: '',
  },
  
  // ✅ Occupation
  occupation: {
    type: String,
    default: '',
  },
  
  // ✅ Emergency Contact
  emergencyContact: {
    type: String,
    default: '',
  },
  emergencyName: {
    type: String,
    default: '',
  },

  // ✅ Current Rental Information
  currentRental: {
    buildingId: { type: Number, default: null },
    buildingNo: { type: String, default: '' },
    unitId: { type: Number, default: null },
    unitNo: { type: String, default: '' },
    unitType: { type: String, default: '' },
    purpose: { type: String, default: '' },
    monthlyRent: { type: Number, default: 0 },
    rentStartDate: { type: String, default: null },
    security: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['Active', 'Inactive', 'Pending'],
      default: 'Active',
    },
  },

  // ✅ Rental History
  rentalHistory: [{
    buildingId: { type: Number },
    buildingNo: { type: String },
    unitId: { type: Number },
    unitNo: { type: String },
    unitType: { type: String },
    purpose: { type: String },
    monthlyRent: { type: Number },
    rentStartDate: { type: String },
    rentEndDate: { type: String },
    security: { type: Number },
    securityReturned: { type: Number },
    securityForfeited: { type: Number },
    remarks: { type: String },
    clearanceDate: { type: String },
  }],

  // ✅ Rent Payment History
  rentHistory: [{
    month: { type: String },
    amount: { type: Number },
    status: { type: String, enum: ['Paid', 'Pending'] },
    paidAt: { type: String },
    remarks: { type: String, default: '' },
  }],

  // ✅ Security History
  securityHistory: [{
    type: { type: String, enum: ['received', 'returned', 'forfeited'] },
    amount: { type: Number },
    date: { type: String },
    note: { type: String },
  }],

  // ✅ Documents
  documents: [{
    id: { type: String },
    templateId: { type: String },
    title: { type: String },
    content: { type: String },
    type: { type: String },
    language: { type: String },
    version: { type: Number, default: 1 },
    createdAt: { type: String },
    updatedAt: { type: String },
  }],

  // ✅ Agreement Files (uploaded images/PDFs)
  agreement: [{
    name: { type: String },
    url: { type: String },
    type: { type: String },
  }],

  // ✅ Notes
  notes: [{
    text: { type: String },
    createdAt: { type: String },
    createdBy: { type: Number },
    createdByName: { type: String },
  }],

  // ✅ Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

// ✅ Indexes for faster queries
customerSchema.index({ cnic: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ name: 1 });
customerSchema.index({ 'currentRental.unitId': 1 });

module.exports = mongoose.model('Customer', customerSchema);