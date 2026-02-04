require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const Prescription = require('./models/Prescription');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Consultation = require('./models/Consultation');
// In your server.js or app.js
const agoraRoutes = require('./routes/agora');
app.use('/api/agora', agoraRoutes);
// Add this to your existing backend routes
app.use('/api/agora', require('./routes/agora'));

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// SMS client configuration
console.log('DEBUG - Account SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('DEBUG - SID length:', process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.length : 'missing');

let smsClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    smsClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio client created successfully');
  } catch (error) {
    console.log('Twilio error:', error.message);
  }
}

// Email sending function
async function sendEmail(to, subject, htmlContent) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent
    };
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// SMS sending function
async function sendSMS(to, message) {
  if (!smsClient) {
    console.log('📱 SMS not configured - skipping SMS notification');
    return false;
  }
  try {
    await smsClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log(`✅ SMS sent to: ${to}`);
    return true;
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return false;
  }
}

const app = express();

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: JSON.stringify({ error: 'Too many login attempts, please try again later.' })
});

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Debug environment variables
console.log('🔍 Environment check:');
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT || '3000 (using default)');

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickmed';
    console.log('🔗 Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🎉 Connected to MongoDB successfully!');
  } catch (error) {
    console.log('😢 MongoDB connection failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check if MongoDB is running locally');
    console.log('2. Verify .env file exists in project root');
    console.log('3. Check MONGODB_URI in .env file');
    console.log('⚠️  Server starting without database connection');
  }
};

// Initialize database connection
connectToMongoDB();

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err.message);
});

const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// 🆕 WebSocket Server
const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('🔔 New WebSocket connection. Total clients:', clients.size);
  ws.on('close', () => {
    clients.delete(ws);
    console.log('🔔 WebSocket disconnected. Total clients:', clients.size);
  });
  ws.on('error', (error) => {
    console.log('🔔 WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast function to send messages to all connected clients
function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// 🆕 User Registration with Validation
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().escape().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('role').isIn(['patient', 'doctor', 'pharmacy', 'admin']).withMessage('Role must be patient, doctor, pharmacy, or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password, name, role, phone, dateOfBirth } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      dateOfBirth,
      lastLogin: new Date()
    });

    await newUser.save();

    // Auto-create doctor profile if role is doctor
    if (newUser.role === 'doctor') {
      await Doctor.createForUser(newUser._id, {
        specialty: 'General Practice',
        licenseNumber: `LIC${Date.now()}`,
        qualifications: [{ degree: 'MBBS', institution: 'Medical School', year: new Date().getFullYear() - 5 }],
        experience: 5,
        bio: 'Experienced medical professional',
        schedule: {
          monday: { available: true, hours: '9:00 AM - 5:00 PM' },
          tuesday: { available: true, hours: '9:00 AM - 5:00 PM' },
          wednesday: { available: true, hours: '9:00 AM - 5:00 PM' },
          thursday: { available: true, hours: '9:00 AM - 5:00 PM' },
          friday: { available: true, hours: '9:00 AM - 5:00 PM' },
          saturday: { available: false, hours: '' },
          sunday: { available: false, hours: '' }
        },
        consultationFee: 50
      });
    }

    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role, 
        name: newUser.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 🆕 User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Update user profile
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'dateOfBirth', 'address', 'emergencyContact', 'medicalInfo'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get all users (admin only)
app.get('/api/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Update user (admin only)
app.put('/api/users/:userId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'User updated successfully',
      user 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Doctor Management Endpoints

// 🆕 Get doctor profile
app.get('/api/doctors/profile', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 CREATE doctor profile
app.post('/api/doctors/profile', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const existingDoctor = await Doctor.findOne({ user: req.user.id });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Doctor profile already exists' });
    }

    const doctor = new Doctor({
      user: req.user.id,
      ...req.body
    });

    await doctor.save();
    await doctor.populate('user', 'name email phone');

    res.status(201).json({ 
      message: 'Doctor profile created successfully',
      doctor 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Update doctor profile
app.put('/api/doctors/profile', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const allowedUpdates = ['specialty', 'licenseNumber', 'qualifications', 'experience', 'bio', 'schedule', 'consultationFee', 'isVerified', 'isActive'];
    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    res.json({ 
      message: 'Doctor profile updated successfully',
      doctor 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get all doctors (public endpoint)
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true, isVerified: true })
      .populate('user', 'name email phone')
      .select('-licenseNumber')
      .sort({ 'ratings.average': -1 });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Get doctor by ID (public endpoint)
app.get('/api/doctors/:doctorId', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId)
      .populate('user', 'name email phone')
      .select('-licenseNumber');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Consultation Endpoints

// 🆕 Book consultation
app.post('/api/consultations', authenticateToken, requireRole(['patient']), async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason, symptoms, consultationType } = req.body;
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor || !doctor.isActive || !doctor.isVerified) {
      return res.status(404).json({ error: 'Doctor not available' });
    }

    const existingBooking = await Consultation.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const consultation = new Consultation({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
      symptoms,
      consultationType
    });

    await consultation.save();
    const populatedConsultation = await Consultation.findById(consultation._id)
      .populate('doctor', 'specialty consultationFee')
      .populate('patient', 'name');

    res.status(201).json({
      message: 'Consultation booked successfully',
      consultation: populatedConsultation
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get patient's consultations
app.get('/api/consultations/patient', authenticateToken, requireRole(['patient']), async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient: req.user.id })
      .populate('doctor', 'specialty consultationFee')
      .populate('doctor.user', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Get doctor's consultations
app.get('/api/consultations/doctor', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }
    const consultations = await Consultation.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json({ consultations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Update consultation status (doctor only)
app.put('/api/consultations/:consultationId/status', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const doctor = await Doctor.findOne({ user: req.user.id });
    const consultation = await Consultation.findOneAndUpdate(
      { _id: req.params.consultationId, doctor: doctor._id },
      { status },
      { new: true }
    ).populate('patient', 'name email phone');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.json({
      message: `Consultation ${status} successfully`,
      consultation
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get available time slots for a doctor
app.get('/api/doctors/:doctorId/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const bookedSlots = await Consultation.find({
      doctor: req.params.doctorId,
      appointmentDate: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const availableSlots = generateTimeSlots(doctor.schedule, bookedSlots);
    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate time slots
function generateTimeSlots(schedule, bookedSlots) {
  const bookedTimes = bookedSlots.map(slot => slot.timeSlot);
  const timeSlots = [];
  for (let hour = 9; hour <= 16; hour++) {
    const timeSlot = `${hour}:00 - ${hour + 1}:00`;
    if (!bookedTimes.includes(timeSlot)) {
      timeSlots.push(timeSlot);
    }
  }
  return timeSlots;
}

// 🆕 Emergency Contacts Endpoints

// 🆕 Update emergency contacts & medical info
app.put('/api/users/emergency-info', authenticateToken, async (req, res) => {
  try {
    const { emergencyContact, medicalInfo } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { emergencyContact, medicalInfo },
      { new: true, runValidators: true }
    );
    res.json({
      message: 'Emergency information updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get emergency info (for emergency access)
app.get('/api/users/:userId/emergency-info', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name emergencyContact medicalInfo');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      patient: {
        name: user.name,
        emergencyContact: user.emergencyContact,
        medicalInfo: user.medicalInfo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Emergency search by patient ID or phone
app.get('/api/emergency/search', async (req, res) => {
  try {
    const { patientId, phone } = req.query;
    if (!patientId && !phone) {
      return res.status(400).json({ error: 'Patient ID or phone required' });
    }
    let query = {};
    if (patientId) query._id = patientId;
    if (phone) query.phone = phone;

    const user = await User.findOne(query)
      .select('name emergencyContact medicalInfo');
    if (!user) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({
      patient: {
        name: user.name,
        emergencyContact: user.emergencyContact,
        medicalInfo: user.medicalInfo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Notification endpoints
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = generateMockNotifications(req.user.role);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock notifications generator
function generateMockNotifications(role) {
  const baseNotifications = [
    {
      id: 1,
      type: 'SYSTEM',
      title: 'Welcome to QuickMed',
      message: 'Your account has been successfully activated.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low'
    }
  ];

  if (role === 'doctor') {
    baseNotifications.push(
      {
        id: 2,
        type: 'PRESCRIPTION',
        title: 'Prescription Dispensed',
        message: 'Your prescription RX1001 for John Smith was dispensed by City Pharmacy',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium'
      }
    );
  }

  if (role === 'pharmacy') {
    baseNotifications.push(
      {
        id: 2,
        type: 'PRESCRIPTION',
        title: 'New Prescription Available',
        message: 'New prescription RX1005 created by Dr. Johnson',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high'
      }
    );
  }

  return baseNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// 🆕 Save prescription to database
app.post('/api/prescriptions', authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
  try {
    const prescription = new Prescription({
      ...req.body,
      createdBy: req.user.id,
      doctorName: req.user.name
    });
    await prescription.save();

    broadcast({
      type: 'PRESCRIPTION_CREATED',
      message: `New prescription ${prescription.prescriptionId} created for ${prescription.patientName}`,
      prescriptionId: prescription.prescriptionId,
      patientName: prescription.patientName,
      doctor: req.user.name,
      medication: prescription.medication,
      timestamp: new Date().toISOString()
    });

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif;">
        <h3 style="color: #2c3e50;">New Prescription Created</h3>
        <p><strong>Prescription ID:</strong> ${prescription.prescriptionId}</p>
        <p><strong>Patient:</strong> ${prescription.patientName}</p>
        <p><strong>Doctor:</strong> ${prescription.doctorName}</p>
        <p><strong>Medication:</strong> ${prescription.medication}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
    `;

    if (process.env.ADMIN_EMAIL) {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Prescription - ${prescription.prescriptionId}`,
        adminEmailHtml
      );
    }

    res.status(201).json({ message: 'Prescription saved successfully', prescription });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🆕 Get prescription by ID (for pharmacies)
app.get('/api/prescriptions/:prescriptionId', async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ 
      prescriptionId: req.params.prescriptionId
    });
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Mark prescription as used
app.put('/api/prescriptions/:prescriptionId/use', authenticateToken, requireRole(['pharmacy', 'admin']), async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { prescriptionId: req.params.prescriptionId, status: 'active' },
      { 
        status: 'used',
        pharmacyUsed: req.user.name,
        usedAt: new Date()
      },
      { new: true }
    );
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found or already used' });
    }

    broadcast({
      type: 'PRESCRIPTION_DISPENSED',
      message: `Prescription ${prescription.prescriptionId} has been dispensed by ${req.user.name}`,
      prescriptionId: prescription.prescriptionId,
      patientName: prescription.patientName,
      pharmacy: req.user.name,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Prescription marked as used', prescription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Public endpoint for patient prescription search (no auth required)
app.get('/api/prescriptions/search/patient', async (req, res) => {
  try {
    const { patientName, prescriptionId } = req.query;
    if (!patientName) {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    let query = {
      patientName: { $regex: patientName, $options: 'i' }
    };
    if (prescriptionId) {
      query.prescriptionId = { $regex: prescriptionId, $options: 'i' };
    }
    const prescriptions = await Prescription.find(query).sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Send prescription via email
app.post('/api/prescriptions/:prescriptionId/email', authenticateToken, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ 
      prescriptionId: req.params.prescriptionId 
    });
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          🏥 QuickMed Prescription
        </h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Prescription Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; width: 150px;">Prescription ID:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.prescriptionId}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Patient:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.patientName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Doctor:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.doctorName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Medication:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.medication}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Dosage:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.dosage}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold;">Instructions:</td><td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">${prescription.instructions}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Date Issued:</td><td style="padding: 8px 0;">${new Date(prescription.date).toLocaleDateString()}</td></tr>
          </table>
        </div>
        <div style="background: #e8f4fc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2c3e50;"><strong>Note:</strong> Present this prescription at any QuickMed-affiliated pharmacy.</p>
        </div>
        <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #7f8c8d;">
          <p>QuickMed Pharmacy System<br><small>This is an automated message. Please do not reply to this email.</small></p>
        </footer>
      </div>
    `;

    const emailSent = await sendEmail(
      req.body.patientEmail,
      `Your Prescription - ${prescription.prescriptionId}`,
      emailHtml
    );

    if (emailSent) {
      res.json({ message: 'Prescription emailed successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Send SMS notification
app.post('/api/prescriptions/:prescriptionId/sms', authenticateToken, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ 
      prescriptionId: req.params.prescriptionId 
    });
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const smsMessage = `QuickMed: Your prescription ${prescription.prescriptionId} for ${prescription.medication} is ready. Show this message at the pharmacy. - Dr. ${prescription.doctorName}`;
    const smsSent = await sendSMS(req.body.patientPhone, smsMessage);

    if (smsSent) {
      res.json({ message: 'SMS notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send SMS' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🆕 Get all prescriptions (for admin, doctor, AND pharmacy)
app.get('/api/prescriptions', authenticateToken, requireRole(['admin', 'doctor', 'pharmacy']), async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 QuickMed API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve static files from public folder
app.use(express.static('public'));

// Pharmacy page route
app.get('/pharmacy', (req, res) => {
  res.json({ 
    message: 'Pharmacy portal is working!',
    instructions: 'Use prescription endpoints to manage prescriptions'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to QuickMed API',
    endpoints: {
      health: '/api/health',
      pharmacy: '/pharmacy',
      prescriptions: '/api/prescriptions'
    },
    database: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Define PORT here, before using it
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api`);
  console.log(`🔔 WebSocket server running on ws://localhost:${PORT}`);
});

// Upgrade HTTP server to handle WebSockets
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});