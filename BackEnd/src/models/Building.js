const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  buildingNo: {
    type: String,
    required: true,
    trim: true,
  },
  reference: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  totalUnits: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  rooms: [{
    unitNo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Room', 'Hall', 'Office', 'Shop', 'Desk', 'Other'],
      default: 'Room',
    },
    deskNo: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Available', 'Rented', 'Maintenance'],
      default: 'Available',
    },
    purpose: {
      type: String,
      default: 'Room',
    },
    monthlyRent: {
      type: Number,
      default: 0,
    },
    rentStartDate: {
      type: String,
      default: null,
    },
    unitImage: {
      type: String,
      default: null,
    },
    reference: {
      type: String,
      default: '',
    },
    tenant: {
      name: { type: String, default: '' },
      cnic: { type: String, default: '' },
      phone: { type: String, default: '' },
      reference: { type: String, default: '' },
      image: { type: String, default: null },
      agreement: { type: Array, default: [] },
      documents: { type: Array, default: [] },
    },
    initialPayment: {
      cashReceived: { type: Number, default: 0 },
      rentPaid: { type: Number, default: 0 },
      securityReceived: { type: Number, default: 0 },
      securityStatus: { type: String, default: null },
      paymentDateTime: { type: String, default: null },
      rentMonths: { type: Number, default: 0 },
    },
    rentHistory: [{
      month: { type: String },
      amount: { type: Number },
      status: { type: String, enum: ['Paid', 'Pending'] },
      paidAt: { type: String },
      remarks: { type: String, default: '' },
    }],
    securityHistory: [{
      type: { type: String, enum: ['received', 'returned', 'forfeited'] },
      amount: { type: Number },
      date: { type: String },
      note: { type: String },
    }],
    clearanceHistory: [{
      type: { type: String, default: 'Rental Clearance' },
      tenantName: { type: String },
      tenantCnic: { type: String },
      tenantPhone: { type: String },
      tenantReference: { type: String },
      tenantImage: { type: String },
      agreement: { type: Array, default: [] },
      monthlyRent: { type: Number },
      securityHeld: { type: Number },
      returnAmount: { type: Number },
      forfeitAmount: { type: Number },
      remarks: { type: String },
      clearedAt: { type: String },
    }],
    transactionHistory: {
      type: Array,
      default: [],
    },
  }],
}, {
  timestamps: true,
});

// ✅ Virtual for total rooms count
buildingSchema.virtual('totalRooms').get(function() {
  return this.rooms.length;
});

// ✅ Virtual for rented rooms count
buildingSchema.virtual('rentedRooms').get(function() {
  return this.rooms.filter(room => room.status === 'Rented').length;
});

// ✅ Virtual for available rooms count
buildingSchema.virtual('availableRooms').get(function() {
  return this.rooms.filter(room => room.status === 'Available').length;
});

// Enable virtuals in JSON output
buildingSchema.set('toJSON', { virtuals: true });
buildingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Building', buildingSchema);