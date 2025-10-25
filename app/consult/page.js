"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from '../context/LanguageContext';

// Translations dictionary
const translations = {
  en: {
    // Navigation
    home: "Home",
    consult: "Consult",
    book: "Book", 
    emergency: "Emergency",
    contact: "Contact",
    insuranceProvider: "Insurance Provider",
    selectInsurance: "Select your insurance", 
    noInsurance: "No insurance",
    insuranceNote: "We'll help verify coverage with your provider",
     travel: "Travel & Stay",
    bookFlights: "Book Flights", 
    findHotels: "Find Hotels",
    medicalTourism: "Medical Tourism",
    airportTaxis: "Airport Taxis",
    travelPackages: "Travel Packages",
    
    // Consult Page
    quickConsultation: "Quick Consultation",
    fullName: "Full name",
    phoneNumber: "Phone number",
    city: "City",
    describeSymptoms: "Describe your symptoms",
    connectToDoctor: "Connect to Doctor",
    backHome: "Back Home",
    pleaseDescribe: "Please describe your symptoms.",
    
    // Travel Mode
    travelMode: "Travel Mode",
    iAmTraveler: "I am a traveler",
    preferredLanguage: "Preferred Language",
    homeCountry: "Home Country",
    specialty: "Preferred Specialty",
    anyDoctor: "Any Available Doctor",
    generalPractitioner: "General Practitioner",
    internalMedicine: "Internal Medicine",
    pediatrics: "Pediatrics",
    cardiology: "Cardiology",
    dermatology: "Dermatology",
    emergencyMedicine: "Emergency Medicine",
    gynecology: "Gynecology", 
    neurosurgeon: "Neurosurgeon", 
    psychiatrist: "Psychiatrist",  
    // Consultation Types
    chat: "Chat",
    voiceCall: "Voice Call", 
    videoCall: "Video Call",
    chatConsultation: "Chat Consultation",
    
    // Results
    yourSummary: "Your summary",
    preliminaryDiagnosis: "Preliminary Diagnosis",
    medicalAdvice: "Medical Advice",
    startChat: "Start Secure Chat",
    callDoctor: "Call Doctor Now",
    startVideo: "Start Video Call",
    getEprescription: "Get ePrescription",
    emergencyCall: "Emergency Call",
    bookHospital: "Book Hospital Visit",
    startOver: "Start Over",
    emergencyContacts: "Emergency Contacts",
    
    // Prescription
    viewSamplePrescription: "View Sample Prescription",
    printPrescription: "Print Prescription",
    sendToPharmacy: "Send to Pharmacy",
    backToConsultation: "Back to Consultation",
    
    // Medical Terms
    acuteInfection: "Acute Upper Respiratory Infection",
    adviceGeneral: "Get plenty of rest, drink warm fluids, and avoid cold beverages.",
    adviceTravel: "Get plenty of rest, drink warm fluids. As a traveler, avoid street food and stay hydrated.",
    
    // Emergency
    notEmergency: "Not an emergency? If this worsens, please dial local emergency services.",
    
    // Travel Features
    travelerBenefits: "Traveler Benefits Activated",
    multiLanguage: "Multi-language doctor matching",
    insuranceSupport: "International insurance support",
    travelEmergency: "24/7 travel emergency line",
    englishStaff: "Hospital with English-speaking staff"
  },
  
  fr: {
    // Navigation
    home: "Accueil",
    consult: "Consultation",
    book: "Réserver",
    emergency: "Urgence", 
    contact: "Contact",
    insuranceProvider: "Assureur",
    selectInsurance: "Sélectionnez votre assurance", 
    noInsurance: "Pas d'assurance",
    insuranceNote: "Nous vous aiderons à vérifier la couverture avec votre assureur",
    travel: "Voyage & Séjour",
    bookFlights: "Réserver Vols",
    findHotels: "Trouver Hôtels",
    medicalTourism: "Tourisme Médical",
    airportTaxis: "Taxis Aéroport",
    travelPackages: "Forfaits Voyage",
    
    // Consult Page
    quickConsultation: "Consultation Rapide",
    fullName: "Nom complet",
    phoneNumber: "Numéro de téléphone",
    city: "Ville",
    describeSymptoms: "Décrivez vos symptômes",
    connectToDoctor: "Connecter au Médecin",
    backHome: "Retour à l'Accueil",
    pleaseDescribe: "Veuillez décrire vos symptômes.",
    
    // Travel Mode
    travelMode: "Mode Voyage",
    iAmTraveler: "Je suis voyageur",
    preferredLanguage: "Langue Préférée",
    homeCountry: "Pays d'Origine",
    specialty: "Spécialité Préférée",
    anyDoctor: "Médecin Disponible",
    generalPractitioner: "Médecin Généraliste",
    internalMedicine: "Médecine Interne",
    pediatrics: "Pédiatrie",
    cardiology: "Cardiologie",
    dermatology: "Dermatologie",
    emergencyMedicine: "Médecine d'Urgence",
    gynecology: "Gynécologie",
    neurosurgeon: "Neurochirurgien",
    psychiatrist: "Psychiatre",
    
    // Consultation Types
    chat: "Chat",
    voiceCall: "Appel Vocal",
    videoCall: "Appel Vidéo",
    chatConsultation: "Consultation par Chat",
    
    // Results
    yourSummary: "Votre résumé",
    preliminaryDiagnosis: "Diagnostic Préliminaire",
    medicalAdvice: "Conseils Médicaux",
    startChat: "Démarrer le Chat Sécurisé",
    callDoctor: "Appeler le Médecin",
    startVideo: "Démarrer l'Appel Vidéo",
    getEprescription: "Obtenir une Ordonnance",
    emergencyCall: "Appel d'Urgence",
    bookHospital: "Réserver à l'Hôpital",
    startOver: "Recommencer",
    emergencyContacts: "Contacts d'Urgence",
    
    // Prescription
    viewSamplePrescription: "Voir un Exemple d'Ordonnance",
    printPrescription: "Imprimer l'Ordonnance",
    sendToPharmacy: "Envoyer à la Pharmacie",
    backToConsultation: "Retour à la Consultation",
    
    // Medical Terms
    acuteInfection: "Infection Respiratoire Supérieure Aiguë",
    adviceGeneral: "Reposez-vous bien, buvez des boissons chaudes et évitez les boissons froides.",
    adviceTravel: "Reposez-vous bien, buvez des boissons chaudes. En tant que voyageur, évitez la nourriture de rue et restez hydraté.",
    
    // Emergency
    notEmergency: "Pas une urgence ? Si cela s'aggrave, veuillez composer les services d'urgence locaux.",
    
    // Travel Features
    travelerBenefits: "Avantages Voyageur Activés",
    multiLanguage: "Médecins multilingues",
    insuranceSupport: "Support assurance internationale",
    travelEmergency: "Ligne d'urgence voyage 24h/24",
    englishStaff: "Hôpital avec personnel anglophone"
  },
  
  es: {
    // Navigation
    home: "Inicio",
    consult: "Consultar",
    book: "Reservar",
    emergency: "Emergencia",
    contact: "Contacto",
    insuranceProvider: "Aseguradora",
    selectInsurance: "Seleccione su seguro", 
    noInsurance: "Sin seguro",
    insuranceNote: "Le ayudaremos a verificar la cobertura con su aseguradora",
     travel: "Viajar & Alojarse",
    bookFlights: "Reservar Vuelos", 
    findHotels: "Encontrar Hoteles",
    medicalTourism: "Turismo Médico",
    airportTaxis: "Taxis Aeropuerto",
    travelPackages: "Paquetes de Viaje",

    
    // Consult Page  
    quickConsultation: "Consulta Rápida",
    fullName: "Nombre completo",
    phoneNumber: "Número de teléfono",
    city: "Ciudad",
    describeSymptoms: "Describa sus síntomas",
    connectToDoctor: "Conectar con Médico",
    backHome: "Volver al Inicio",
    pleaseDescribe: "Por favor describa sus síntomas.",
    
    // Travel Mode
    travelMode: "Modo Viaje", 
    iAmTraveler: "Soy viajero",
    preferredLanguage: "Idioma Preferido",
    homeCountry: "País de Origen",
    specialty: "Especialidad Preferida",
    anyDoctor: "Médico Disponible",
    generalPractitioner: "Médico General",
    internalMedicine: "Medicina Interna",
    pediatrics: "Pediatría",
    cardiology: "Cardiología",
    dermatology: "Dermatología",
    emergencyMedicine: "Medicina de Emergencia",
    gynecology: "Ginecología",
    neurosurgeon: "Neurocirujano",
    psychiatrist: "Psiquiatra",
    
    // Consultation Types
    chat: "Chat",
    voiceCall: "Llamada de Voz",
    videoCall: "Llamada de Video",
    chatConsultation: "Consulta por Chat",
    
    // Results
    yourSummary: "Su resumen",
    preliminaryDiagnosis: "Diagnóstico Preliminar",
    medicalAdvice: "Consejo Médico",
    startChat: "Iniciar Chat Seguro",
    callDoctor: "Llamar al Médico",
    startVideo: "Iniciar Video Llamada",
    getEprescription: "Obtener Receta",
    emergencyCall: "Llamada de Emergencia",
    bookHospital: "Reservar Hospital",
    startOver: "Comenzar de Nuevo",
    emergencyContacts: "Contactos de Emergencia",
    
    // Prescription
    viewSamplePrescription: "Ver Receta de Ejemplo",
    printPrescription: "Imprimir Receta",
    sendToPharmacy: "Enviar a Farmacia",
    backToConsultation: "Volver a Consulta",
    
    // Medical Terms
    acuteInfection: "Infección Aguda de las Vías Respiratorias Superiores",
    adviceGeneral: "Descanse mucho, beba líquidos calientes y evite bebidas frías.",
    adviceTravel: "Descanse mucho, beba líquidos calientes. Como viajero, evite la comida callejera y manténgase hidratado.",
    
    // Emergency
    notEmergency: "¿No es una emergencia? Si empeora, por favor llame a los servicios de emergencia locales.",
    
    // Travel Features
    travelerBenefits: "Beneficios para Viajeros Activados",
    multiLanguage: "Médicos multilingües",
    insuranceSupport: "Soporte de seguro internacional",
    travelEmergency: "Línea de emergencia para viajeros 24/7",
    englishStaff: "Hospital con personal que habla inglés"
  }
};

export default function ConsultPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    symptoms: "",
    specialty: "",
    consultationType: "chat",
    travelMode: false,
    language: "",
    homeCountry: "",
    insuranceProvider: "", 
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
      setError(t.pleaseDescribe);
      return;
    }
    setError("");

    const doctors = [
      { 
        name: "Dr. Ada Okoye", 
        specialty: t.generalPractitioner, 
        rating: "4.9", 
        eta: "~2–5 min", 
        license: "MD, MBBS",
        insurances: ["NHIS", "RedCare", "Avon HMO", "Hygeia"] 
      },
      { 
        name: "Dr. Femi Yusuf", 
        specialty: t.internalMedicine, 
        rating: "4.8", 
        eta: "~3–6 min", 
        license: "MD, FWACP",
        insurances: ["NHIS", "Clearline", "Mediplan"] 
      },
      { 
        name: "Dr. Chike Nwosu", 
        specialty: t.pediatrics, 
        rating: "4.7", 
        eta: "~5–8 min", 
        license: "MD, FMCPaed",
        insurances: ["NHIS", "RedCare", "Premiere HMO"] 
      },
      { 
        name: "Dr. Zainab Bello", 
        specialty: t.emergencyMedicine, 
        rating: "4.9", 
        eta: "~1–3 min", 
        license: "MD, FWACS",
        insurances: ["NHIS", "Avon HMO", "Hygeia", "Anchor HMO"] 
      },
      { 
        name: "Dr. Ahmed Musa", 
        specialty: t.cardiology, 
        rating: "4.8", 
        eta: "~4–7 min", 
        license: "MD, FMCP",
        insurances: ["NHIS", "Sterling Health", "Reliance HMO"] 
      },
      { 
        name: "Dr. Grace Okafor", 
        specialty: t.dermatology, 
        rating: "4.6", 
        eta: "~3–6 min", 
        license: "MD, FMCD",
        insurances: ["NHIS", "RedCare", "Clearline"] 
      },
      { 
        name: "Dr. Fatima Abdul", 
        specialty: t.gynecology, 
        rating: "4.8", 
        eta: "~4–7 min", 
        license: "MD, FMCOG",
        insurances: ["NHIS", "Avon HMO", "Mediplan"] 
      },
      { 
        name: "Dr. Micheal Musa", 
        specialty: t.neurosurgeon, 
        rating: "4.7", 
        eta: "~4–7 min", 
        license: "MD, FRCS",
        insurances: ["NHIS", "Hygeia", "Premiere HMO"] 
      },
      { 
        name: "Dr. Patrick Abel", 
        specialty: t.psychiatrist, 
        rating: "4.9", 
        eta: "~3–6 min", 
        license: "MD, APAF",
        insurances: ["NHIS", "RedCare", "Avon HMO", "Sterling Health"] 
      },
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
      diagnosis: t.acuteInfection,
      advice: form.travelMode ? t.adviceTravel : t.adviceGeneral,
      travelMode: form.travelMode,
      language: form.language || 'english',
      homeCountry: form.homeCountry || 'Nigeria'
    });
  }

  function generatePrescription() {
    setShowPrescription(true);
  }

  function reset() {
    setForm({ name: "", phone: "", city: "", symptoms: "", specialty: "", consultationType: "chat", travelMode: false, language: "", homeCountry: "" });
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
    diagnosis: match?.diagnosis || t.acuteInfection,
    medications: [
      { name: "Paracetamol 500mg", dosage: "1 tablet", frequency: "Every 6 hours", duration: "3 days", notes: "For fever and pain" },
      { name: "Amoxicillin 500mg", dosage: "1 capsule", frequency: "Every 8 hours", duration: "5 days", notes: "Take with food" },
      { name: "Vitamin C 1000mg", dosage: "1 tablet", frequency: "Once daily", duration: "7 days", notes: "Immune support" },
      { name: "Cough Syrup", dosage: "10ml", frequency: "Every 8 hours", duration: "5 days", notes: "For dry cough" }
    ],
    instructions: match?.advice || t.adviceGeneral,
    followUp: "Return in 5 days if no improvement",
    prescriptionId: `RX-${Date.now().toString().slice(-6)}`
  };

  return (
    <section className="container consult">
      <h1 className="consult-title">{t.quickConsultation}</h1>

      {!match ? (
        <form onSubmit={handleSubmit} className="card consult-form">
          <label>
            {t.fullName}
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Frank Eyam"
            />
          </label>

          <label>
            {t.phoneNumber}
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="e.g., 0816 903 7959"
            />
          </label>

          <label>
            {t.city}
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="e.g., Abuja"
            />
          </label>

          <label className="travel-mode-toggle">
            <div className="travel-mode-header">
              <span className="travel-icon">🧳</span>
              <span>{t.travelMode}</span>
            </div>
            <div className="toggle-container">
              <span className="toggle-label">{t.iAmTraveler}</span>
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
                  {t.preferredLanguage}
                  <select name="language" value={form.language || ''} onChange={onChange}>
                    <option value="">English</option>
                    <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                    <option value="arabic">Arabic</option>
                    <option value="portuguese">Portuguese</option>
                  </select>
                </label>
                <label>
                  {t.homeCountry}
                  <input
                    name="homeCountry"
                    value={form.homeCountry || ''}
                    onChange={onChange}
                    placeholder="e.g., United States"
                  />
                </label>
                <label>
                  {t.insuranceProvider}
                  <select name="insuranceProvider" value={form.insuranceProvider || ''} onChange={onChange}>
                    <option value="">{t.selectInsurance}</option>
                    <option value="none">{t.noInsurance}</option>
                    <optgroup label="United States">
                      <option value="unitedhealthcare">UnitedHealthcare</option>
                      <option value="anthem">Anthem Blue Cross</option>
                      <option value="aetna">Aetna</option>
                      <option value="cigna">Cigna</option>
                      <option value="humana">Humana</option>
                      <option value="kaiser">Kaiser Permanente</option>
                    </optgroup>
                    <optgroup label="United Kingdom">
                      <option value="bupa">BUPA International</option>
                      <option value="axa">AXA PPP Healthcare</option>
                      <option value="aviva">Aviva</option>
                      <option value="vitality">VitalityHealth</option>
                    </optgroup>
                    <optgroup label="Europe">
                      <option value="allianz">Allianz Care</option>
                      <option value="generali">Generali</option>
                      <option value="zurich">Zurich Insurance</option>
                      <option value="mapfre">MAPFRE</option>
                    </optgroup>
                    <optgroup label="Canada">
                      <option value="manulife">Manulife</option>
                      <option value="sunlife">Sun Life Financial</option>
                      <option value="greatwest">Great-West Life</option>
                    </optgroup>
                    <optgroup label="Australia">
                      <option value="bupa-au">BUPA Australia</option>
                      <option value="medibank">Medibank</option>
                      <option value="nib">nib Health Insurance</option>
                    </optgroup>
                    <optgroup label="International">
                      <option value="cigna-global">Cigna Global</option>
                      <option value="allianz-worldwide">Allianz Worldwide Care</option>
                      <option value="aetna-intl">Aetna International</option>
                      <option value="now-health">Now Health International</option>
                    </optgroup>
                  </select>
                  <small className="insurance-note">{t.insuranceNote}</small>
                </label>
              </div>
            )}
          </label>

          <label>
            {t.specialty}
            <select name="specialty" value={form.specialty} onChange={onChange}>
              <option value="">{t.anyDoctor}</option>
              <option value="general">{t.generalPractitioner}</option>
              <option value="internal">{t.internalMedicine}</option>
              <option value="pediatrics">{t.pediatrics}</option>
              <option value="cardiology">{t.cardiology}</option>
              <option value="dermatology">{t.dermatology}</option>
              <option value="emergency">{t.emergencyMedicine}</option>
              <option value="gynecology">{t.gynecology}</option>
              <option value="neurosurgeon">{t.neurosurgeon}</option>
              <option value="psychiatrist">{t.psychiatrist}</option>
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
                💬 {t.chat}
              </button>
              <button 
                type="button" 
                className={`option-btn ${form.consultationType === 'call' ? 'active' : ''}`}
                onClick={() => handleConsultationType('call')}
              >
                📞 {t.voiceCall}
              </button>
              <button 
                type="button" 
                className={`option-btn ${form.consultationType === 'video' ? 'active' : ''}`}
                onClick={() => handleConsultationType('video')}
              >
                🎥 {t.videoCall}
              </button>
            </div>
          </label>

          <label>
            {t.describeSymptoms}
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
            <button type="submit" className="btn btn-primary">{t.connectToDoctor}</button>
            <Link href="/" className="btn btn-ghost">{t.backHome}</Link>
          </div>
        </form>
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
                {match.consultationType === 'chat' && `💬 ${t.chatConsultation}`}
                {match.consultationType === 'call' && `📞 ${t.voiceCall}`}  
                {match.consultationType === 'video' && `🎥 ${t.videoCall}`}
              </div>
              {match.travelMode && (
                <div className="travel-badge">
                  🧳 Travel Mode • Language: {match.language}
                </div>
              )}
            </div>
          </div>

          <div className="insurance-section">
            <p className="insurance-label">Accepts Insurance:</p>
            <div className="insurance-badges">
              {match.insurances?.map((insurance, index) => (
                <span key={index} className="insurance-badge">{insurance}</span>
              ))}
            </div>
          </div>

          <div className="match-summary">
            <div className="label">{t.yourSummary}:</div>
            <div className="text">{match.caseSummary}</div>
          </div>

          {match.travelMode && (
            <div className="travel-features">
              <h4>🌍 {t.travelerBenefits}</h4>
              <div className="travel-feature">✅ {t.multiLanguage}</div>
              <div className="travel-feature">✅ {t.insuranceSupport}</div>
              <div className="travel-feature">✅ {t.travelEmergency}</div>
              <div className="travel-feature">✅ {t.englishStaff}</div>
            </div>
          )}

          <div className="match-diagnosis">
            <div className="label">{t.preliminaryDiagnosis}:</div>
            <div className="text">{match.diagnosis}</div>
          </div>

          <div className="match-advice">
            <div className="label">{t.medicalAdvice}:</div>
            <div className="text">{match.advice}</div>
          </div>

          <div className="row">
            <button
              className="btn btn-primary"
              onClick={() => alert(`Starting ${match.consultationType} consultation (demo)`)}
            >
              {match.consultationType === 'chat' && t.startChat}
              {match.consultationType === 'call' && t.callDoctor}
              {match.consultationType === 'video' && t.startVideo}
            </button>
            <button
              className="btn btn-secondary"
              onClick={generatePrescription}
            >
              📋 {t.getEprescription}
            </button>
          </div>

          <div className="row">
            <button
              className="btn btn-ghost"
              onClick={() => alert("Calling doctor (demo)")}
            >
              {t.emergencyCall}
            </button>
            <Link href="/book" className="btn btn-ghost">
              🏥 {t.bookHospital}
            </Link>
          </div>

          <div className="tiny">
            {t.notEmergency}
          </div>

          <div className="row">
            <button className="btn btn-ghost" onClick={reset}>{t.startOver}</button>
            <Link href="/emergency" className="btn btn-ghost" style={{background: '#fee', color: '#e74c3c', borderColor: '#e74c3c'}}>
              🚨 {t.emergencyContacts}
            </Link>
          </div>
        </div>
      )}

      {showPrescription && (
        <div className="card prescription-card">
          <div className="prescription-header">
            <div className="prescription-logo">
              <Image src="/quickmed-icon.png" alt="QuickMed Care" width={50} height={50} />
              <div>
                <h2>QuickMed Care</h2>
                <p>Secure Digital Prescription</p>
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

          <div className="qr-prescription-system">
            <div className="qr-section">
              <div className="qr-container">
                <div className="qr-code-placeholder">
                  <div className="qr-icon">📱</div>
                  <h3>Secure QR Prescription</h3>
                  <p>Your medications are securely stored</p>
                </div>
                <div className="prescription-code">
                  <strong>Code:</strong> 
                  <span className="code-value">{prescriptionData.prescriptionId}</span>
                </div>
              </div>
              
              <div className="pharmacy-instructions">
                <h4>🚀 How to Get Your Medications:</h4>
                <div className="steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <p>Visit any <strong>QuickMed Partner Pharmacy</strong></p>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <p>Show this <strong>Prescription Code</strong> to pharmacist</p>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <p>Pharmacist retrieves your secure prescription</p>
                  </div>
                  <div className="step">
                    <span className="step-number">4</span>
                    <p>Receive medications with professional guidance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="security-features">
              <h4>🔒 Security Benefits:</h4>
              <div className="features-grid">
                <div className="feature">
                  <span className="feature-icon">🛡️</span>
                  <p>Prevents medication misuse</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">💊</span>
                  <p>Professional dispensing only</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🏥</span>
                  <p>Quality-controlled pharmacies</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">📋</span>
                  <p>Pharmacist counseling included</p>
                </div>
              </div>
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

            <div className="partner-pharmacies">
              <h4>🏪 Partner Pharmacies Near You:</h4>
              <div className="pharmacy-list">
                <div className="pharmacy">
                  <strong>MedPlus Pharmacy</strong> - 1.2km • 24/7
                </div>
                <div className="pharmacy">
                  <strong>HealthPlus Abuja</strong> - 2.1km • Open until 10PM
                </div>
                <div className="pharmacy">
                  <strong>Mopheth Pharmacy</strong> - 3.4km • 24/7
                </div>
                <div className="pharmacy">
                  <strong>Alpha Pharmacy</strong> - 0.8km • Open until 9PM
                </div>
              </div>
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
              📄 Print Prescription Code
            </button>
            <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(prescriptionData.prescriptionId)}>
              📋 Copy Code
            </button>
            <button className="btn btn-ghost" onClick={() => setShowPrescription(false)}>
              {t.backToConsultation}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}