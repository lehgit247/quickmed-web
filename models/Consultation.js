const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: [String],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  consultationType: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    default: 'in-person'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Index for efficient queries
consultationSchema.index({ doctor: 1, appointmentDate: 1 });
consultationSchema.index({ patient: 1, appointmentDate: 1 });

module.exports = mongoose.model('Consultation', consultationSchema);

// In your consultation details page
{consultation.status === 'confirmed' && (
  <VideoCall 
    consultationId={consultation._id}
    user={currentUser}
    onCallEnd={() => {
      // Update consultation status to completed
      updateConsultationStatus(consultation._id, 'completed');
    }}
  />
)}