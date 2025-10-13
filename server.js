const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://eyamfrank2_db_user:hfoIVQPdhLlHe1K1@patient-doctor-platform.lek8y9l.mongodb.net/patient_doctor_platform?retryWrites=true&w=majority&appName=patient-doctor-platform";

console.log('📞 Calling database...');

// Phone call to database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🎉 YAY! Connected to database!');
    
    // ==========================================
    // PATIENT MODEL - Our patient data bed 🛏️
    // ==========================================
    const patientSchema = new mongoose.Schema({
      name: String,
      age: Number,
      symptoms: String,
      location: String,
      phone: String,
      emergencyContact: String,
      createdAt: { type: Date, default: Date.now }
    });

    const Patient = mongoose.model('Patient', patientSchema);

    // ==========================================
    // DOCTOR MODEL - Our doctor data bed 🩺
    // ==========================================
    const doctorSchema = new mongoose.Schema({
      name: String,
      specialty: String,
      licenseNumber: String,
      hospital: String,
      location: String,
      phone: String,
      available: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    });

    const Doctor = mongoose.model('Doctor', doctorSchema);

    // ==========================================
    // TEST: Save a sample patient and doctor
    // ==========================================
    async function testDatabase() {
      try {
        // Create a test patient
        const testPatient = new Patient({
          name: "Chinedu Okoro",
          age: 28,
          symptoms: "Headache and fever",
          location: "Lagos, Nigeria",
          phone: "+2348012345678",
          emergencyContact: "+2348098765432"
        });

        // Create a test doctor
        const testDoctor = new Doctor({
          name: "Dr. Adebayo Ojo",
          specialty: "General Physician",
          licenseNumber: "MDNG-12345",
          hospital: "Lagos General Hospital",
          location: "Lagos, Nigeria",
          phone: "+2348055512345",
          available: true
        });

        // Save both to database
        await testPatient.save();
        await testDoctor.save();
        
        console.log('✅ Test patient and doctor saved successfully!');
        console.log('🏥 Your health app database is READY!');
        
      } catch (error) {
        console.log('❌ Error saving test data:', error.message);
      }
    }

    // Run the test
    testDatabase();
  })
  .catch(err => console.log('😢 Oops! Connection failed:', err.message));

console.log('👋 Hello from my health app!');
console.log('🚀 Server will run on port 3000 when we add Express!');