"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ConsultPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    symptoms: "",
    specialty: "",
    consultationType: "chat",
    travelMode: false,
  });
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleConsultationType(type) {
    setForm({ ...form, consultationType: type });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.symptoms.trim()) {
      setError("Please describe your symptoms.");
      return;
    }
    setError("");

    const doctors = [
      { name: "Dr. Ada Okoye", specialty: "General Practitioner", rating: "4.9", eta: "~2–5 min", license: "MD, MBBS" },
      { name: "Dr. Femi Yusuf", specialty: "Internal Medicine", rating: "4.8", eta: "~3–6 min", license: "MD, FWACP" },
      { name: "Dr. Chike Nwosu", specialty: "Pediatrics", rating: "4.7", eta: "~5–8 min", license: "MD, FMCPaed" },
      { name: "Dr. Zainab Bello", specialty: "Emergency Medicine", rating: "4.9", eta: "~1–3 min", license: "MD, FWACS" },
      { name: "Dr. Ahmed Musa", specialty: "Cardiology", rating: "4.8", eta: "~4–7 min", license: "MD, FMCP" },
      { name: "Dr. Grace Okafor", specialty: "Dermatology", rating: "4.6", eta: "~3–6 min", license: "MD, FMCD" },
    ];

    // Filter doctors by specialty if selected
    const filteredDoctors = form.specialty 
      ? doctors.filter(doc => doc.specialty.toLowerCase().includes(form.specialty))
      : doctors;

    const availableDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    const pick = availableDoctors[Math.floor(Math.random() * availableDoctors.length)];

    setMatch({
  ...pick,
  caseSummary: form.symptoms.slice(0, 160),
  consultationType: form.consultationType,
  diagnosis: "Acute Upper Respiratory Infection",
  advice: form.travelMode 
    ? "Get plenty of rest, drink warm fluids. As a traveler, avoid street food and stay hydrated."
    : "Get plenty of rest, drink warm fluids, and avoid cold beverages.",
  travelMode: form.travelMode,
  language: form.language || 'english',
  homeCountry: form.homeCountry || 'Nigeria'
});
  }

  function generatePrescription() {
    setShowPrescription(true);
  }

  function reset() {
    setForm({ name: "", phone: "", city: "", symptoms: "", specialty: "", consultationType: "chat" });
    setMatch(null);
    setShowPrescription(false);
  }

  // Mock prescription data
  const prescriptionData = {
    patientName: form.name || "Patient",
    patientAge: "35",
    patientGender: "Male",
    date: new Date().toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    doctor: match?.name || "Dr. Ada Okoye",
    doctorLicense: match?.license || "MD, MBBS",
    diagnosis: match?.diagnosis || "Acute Upper Respiratory Infection",
    medications: [
      { name: "Paracetamol 500mg", dosage: "1 tablet", frequency: "Every 6 hours", duration: "3 days", notes: "For fever and pain" },
      { name: "Amoxicillin 500mg", dosage: "1 capsule", frequency: "Every 8 hours", duration: "5 days", notes: "Take with food" },
      { name: "Vitamin C 1000mg", dosage: "1 tablet", frequency: "Once daily", duration: "7 days", notes: "Immune support" },
      { name: "Cough Syrup", dosage: "10ml", frequency: "Every 8 hours", duration: "5 days", notes: "For dry cough" }
    ],
    instructions: match?.advice || "Get plenty of rest and maintain hydration. Return if symptoms worsen.",
    followUp: "Return in 5 days if no improvement",
    prescriptionId: `RX-${Date.now().toString().slice(-6)}`
  };

  return (
    <section className="container consult">
      <h1 className="consult-title">Quick Consultation</h1>

      {!match ? (
        <form onSubmit={handleSubmit} className="card consult-form">
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Frank Eyam"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="e.g., 0816 903 7959"
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="e.g., Abuja"
            />
          </label>
{/* ADD THIS WHOLE BLOCK AFTER THE CITY INPUT */}
<label className="travel-mode-toggle">
  <div className="travel-mode-header">
    <span className="travel-icon">🧳</span>
    <span>Travel Mode</span>
  </div>
  <div className="toggle-container">
    <span className="toggle-label">I am a traveler</span>
    <label className="switch">
      <input 
        type="checkbox" 
        checked={form.travelMode}
        onChange={(e) => setForm({...form, travelMode: e.target.checked})}
      />
      <span className="slider"></span>
    </label>
  </div>
  {form.travelMode && (
    <div className="travel-mode-options">
      <label>
        Preferred Language
        <select name="language" value={form.language || ''} onChange={onChange}>
          <option value="">English</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="arabic">Arabic</option>
          <option value="portuguese">Portuguese</option>
        </select>
      </label>
      <label>
        Home Country
        <input
          name="homeCountry"
          value={form.homeCountry || ''}
          onChange={onChange}
          placeholder="e.g., United States"
        />
      </label>
    </div>
  )}
</label>
          <label>
            Preferred Specialty (Optional)
            <select name="specialty" value={form.specialty} onChange={onChange}>
              <option value="">Any Available Doctor</option>
              <option value="general">General Practitioner</option>
              <option value="internal">Internal Medicine</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="emergency">Emergency Medicine</option>
            </select>
          </label>

          <label>
            Consultation Type
            <div className="consult-options">
              <button 
                type="button" 
                className={`option-btn ${form.consultationType === 'chat' ? 'active' : ''}`}
                onClick={() => handleConsultationType('chat')}
              >
                💬 Chat
              </button>
              <button 
                type="button" 
                className={`option-btn ${form.consultationType === 'call' ? 'active' : ''}`}
                onClick={() => handleConsultationType('call')}
              >
                📞 Voice Call
              </button>
              <button 
                type="button" 
                className={`option-btn ${form.consultationType === 'video' ? 'active' : ''}`}
                onClick={() => handleConsultationType('video')}
              >
                🎥 Video Call
              </button>
            </div>
          </label>

          <label>
            Describe your symptoms
            <textarea
              name="symptoms"
              rows={6}
              value={form.symptoms}
              onChange={onChange}
              placeholder="e.g., fever, cough, headache for 2 days…"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="row">
            <button type="submit" className="btn btn-primary">Connect to Doctor</button>
            <Link href="/" className="btn btn-ghost">Back Home</Link>
          </div>
        </form>
      ) : showPrescription ? (
        <div className="card prescription-card">
          <div className="prescription-header">
            <div className="prescription-logo">
              <Image src="/quickmed-icon.png" alt="QuickMed Care" width={50} height={50} />
              <div>
                <h2>QuickMed Care</h2>
                <p>Digital Health Platform</p>
              </div>
            </div>
            <div className="prescription-id">
              <strong>Prescription ID:</strong> {prescriptionData.prescriptionId}
            </div>
          </div>

          <div className="prescription-info">
            <div className="patient-info">
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {prescriptionData.patientName}</p>
              <p><strong>Age:</strong> {prescriptionData.patientAge} years</p>
              <p><strong>Gender:</strong> {prescriptionData.patientGender}</p>
              <p><strong>Date:</strong> {prescriptionData.date}</p>
            </div>
            
            <div className="doctor-info">
              <h3>Prescribing Doctor</h3>
              <p><strong>Name:</strong> {prescriptionData.doctor}</p>
              <p><strong>License:</strong> {prescriptionData.doctorLicense}</p>
              <p><strong>Diagnosis:</strong> {prescriptionData.diagnosis}</p>
            </div>
          </div>

          <div className="medications-section">
            <h3>Medications Prescribed</h3>
            <div className="medications-table">
              <div className="table-header">
                <div>Medication</div>
                <div>Dosage</div>
                <div>Frequency</div>
                <div>Duration</div>
                <div>Notes</div>
              </div>
              {prescriptionData.medications.map((med, index) => (
                <div key={index} className="table-row">
                  <div><strong>{med.name}</strong></div>
                  <div>{med.dosage}</div>
                  <div>{med.frequency}</div>
                  <div>{med.duration}</div>
                  <div>{med.notes}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="prescription-footer">
            <div className="instructions">
              <h4>Medical Advice & Instructions</h4>
              <p>{prescriptionData.instructions}</p>
            </div>
            
            <div className="follow-up">
              <h4>Follow-up</h4>
              <p>{prescriptionData.followUp}</p>
            </div>

            <div className="signature">
              <div className="signature-line"></div>
              <p><strong>{prescriptionData.doctor}</strong></p>
              <p>Licensed Medical Practitioner</p>
              <p>QuickMed Care</p>
            </div>
          </div>

          <div className="prescription-actions">
            <button className="btn btn-primary" onClick={() => window.print()}>
              📄 Print Prescription
            </button>
            <button className="btn btn-secondary" onClick={() => alert("Prescription sent to pharmacy!")}>
              🏥 Send to Pharmacy
            </button>
            <button className="btn btn-ghost" onClick={() => setShowPrescription(false)}>
              Back to Consultation
            </button>
          </div>
        </div>
      ) : (
        <div className="card match">
          <div className="match-header">
            <Image src="/quickmed-icon.png" alt="" width={40} height={40} className="match-icon" />
            <div>
              <div className="match-name">{match.name}</div>
              <div className="match-sub">
                {match.specialty} • ⭐ {match.rating} • ETA {match.eta}
              </div>
              <div className="consult-type-badge">
                {match.consultationType === 'chat' && '💬 Chat Consultation'}
                {match.consultationType === 'call' && '📞 Voice Call'}  
                {match.consultationType === 'video' && '🎥 Video Call'}
              </div>
              {match.travelMode && (
  <div className="travel-badge">
    🧳 Travel Mode • Language: {match.language}
  </div>
)}
            </div>
          </div>

          <div className="match-summary">
            <div className="label">Your summary:</div>
            <div className="text">{match.caseSummary}</div>
          </div>
          
{match.travelMode && (
  <div className="travel-features">
    <h4>🌍 Traveler Benefits Activated</h4>
    <div className="travel-feature">✅ Multi-language doctor matching</div>
    <div className="travel-feature">✅ International insurance support</div>
    <div className="travel-feature">✅ 24/7 travel emergency line</div>
    <div className="travel-feature">✅ Hospital with English-speaking staff</div>
  </div>
)}
          <div className="match-diagnosis">
            <div className="label">Preliminary Diagnosis:</div>
            <div className="text">{match.diagnosis}</div>
          </div>

          <div className="match-advice">
            <div className="label">Medical Advice:</div>
            <div className="text">{match.advice}</div>
          </div>

          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => alert(`Starting ${match.consultationType} consultation (demo)`)}
            >
              {match.consultationType === 'chat' && 'Start Secure Chat'}
              {match.consultationType === 'call' && 'Call Doctor Now'}
              {match.consultationType === 'video' && 'Start Video Call'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={generatePrescription}
            >
              📋 Get ePrescription
            </button>
          </div>

          <div className="row">
            <button
              className="btn btn-ghost"
              onClick={() => alert("Calling doctor (demo)")}
            >
              Emergency Call
            </button>
            <Link href="/book" className="btn btn-ghost">
              🏥 Book Hospital Visit
            </Link>
          </div>

          <div className="tiny">
            Not an emergency? If this worsens, please dial local emergency services.
          </div>

          <div className="row">
            <button className="btn btn-ghost" onClick={reset}>Start Over</button>
            <button className="btn btn-ghost" onClick={() => setShowPrescription(true)}>
              View Sample Prescription
            </button>
          </div>
        </div>
      )}
    </section>
  );
}