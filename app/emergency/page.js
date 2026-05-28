"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { getTranslations } from "../i18n";

const emergencyContacts = {
  nigeria: [
    { name: "Police Emergency", number: "112", description: "National Emergency Number", type: "police" },
    { name: "Police Alternative", number: "199", description: "Nigerian Police Force", type: "police" },
    { name: "Fire Service", number: "112", description: "Fire & Rescue Services", type: "fire" },
    { name: "Ambulance", number: "112", description: "Emergency Medical Services", type: "ambulance" },
    { name: "FRSC (Road Safety)", number: "122", description: "Federal Road Safety Corps", type: "traffic" }
  ],
  hospitals: [
    { name: "National Hospital Abuja", number: "+234-9-460-1000", description: "24/7 Emergency Unit", type: "hospital" },
    { name: "Lagos University Teaching Hospital", number: "+234-1-280-5432", description: "Emergency & Trauma Center", type: "hospital" },
    { name: "Red Cross Society", number: "+234-9-523-5960", description: "Emergency Relief Services", type: "ngo" },
    { name: "St. Nicholas Hospital Lagos", number: "+234-1-277-3570", description: "24/7 Emergency Care", type: "hospital" }
  ],
  international: [
    { name: "US Embassy Emergency", number: "+234-9-461-4000", description: "American Citizen Services", type: "embassy" },
    { name: "UK Embassy Emergency", number: "+234-9-462-2200", description: "British Citizen Services", type: "embassy" },
    { name: "Travel Emergency Line", number: "+234-700-225-5636", description: "QuickMed Travel Emergency", type: "quickmed" }
  ]
};

export default function EmergencyPage() {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const handleSOS = () => {
    alert("Emergency alert sent. Sharing your location with nearby hospitals and emergency contacts.");
  };

  const renderContacts = (contacts) => (
    <div className="contacts-grid">
      {contacts.map((contact, index) => (
        <div key={index} className={`contact-card ${contact.type}`}>
          <div className="contact-info">
            <h3>{contact.name}</h3>
            <p>{contact.description}</p>
          </div>
          <a href={`tel:${contact.number}`} className="call-button">
            {t.call}
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <section className="container emergency">
      <div className="emergency-header">
        <h1 className="emergency-title">{t.emergencyContacts}</h1>
        <p className="emergency-subtitle">{t.immediateHelp}</p>
      </div>

      <div className="sos-section">
        <button className="sos-button" onClick={handleSOS}>
          <span className="sos-pulse" />
          <span className="sos-text">{t.sosEmergency}</span>
          <span className="sos-subtext">{t.tapImmediateHelp}</span>
        </button>
        <p className="sos-warning">{t.lifeThreatening}</p>
      </div>

      <div className="contacts-section">
        <h2>{t.nationalEmergency}</h2>
        {renderContacts(emergencyContacts.nigeria)}
      </div>

      <div className="contacts-section">
        <h2>{t.hospitalEmergency}</h2>
        {renderContacts(emergencyContacts.hospitals)}
      </div>

      <div className="contacts-section">
        <h2>{t.internationalEmergency}</h2>
        {renderContacts(emergencyContacts.international)}
      </div>

      <div className="emergency-instructions">
        <h3>{t.emergencyInstructions}</h3>
        <div className="instructions-grid">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="instruction">
              <span className="instruction-number">{step}</span>
              <p>{step === 1 ? 'Stay calm and assess the situation.' : step === 2 ? 'Call 112 for immediate assistance.' : step === 3 ? 'Share your exact location.' : 'Follow emergency guidance carefully.'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="emergency-footer">
        <Link href="/consult" className="btn btn-primary">{t.quickConsult}</Link>
        <Link href="/book" className="btn btn-ghost">{t.bookHospital}</Link>
      </div>
    </section>
  );
}
