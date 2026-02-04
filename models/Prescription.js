const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: false
  },
  patientGender: {
    type: String,
    required: false,
    default: 'Not specified'
  },
  doctorName: {
    type: String,
    required: true
  },
  doctorLicense: {
    type: String,
    required: false,
    default: 'Not specified'
  },
  medication: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: false,
    default: 'Not specified'
  },
  notes: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'used'],
    default: 'active'
  },
  pharmacyUsed: {
    type: String,
    required: false
  },
  usedAt: {
    type: Date,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);