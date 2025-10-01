"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState("Abuja");
  
  const emergencyContacts = {
    nigeria: [
      { name: "Police Emergency", number: "112", description: "National Emergency Number", type: "police" },
      { name: "Police Alternative", number: "199", description: "Nigerian Police Force", type: "police" },
      { name: "Fire Service", number: "112", description: "Fire & Rescue Services", type: "fire" },
      { name: "Ambulance", number: "112", description: "Emergency Medical Services", type: "ambulance" },
      { name: "FRSC (Road Safety)", number: "122", description: "Federal Road Safety Corps", type: "traffic" },
      { name: "NDLEA (Drug Law)", number: "0800-1020-3040", description: "National Drug Law Enforcement", type: "police" }
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

  const handleSOS = () => {
    // In a real app, this would trigger emergency protocols
    alert("🚨 EMERGENCY ALERT! Sharing your location with nearby hospitals and emergency contacts. Help is on the way!");
    
    // Simulate calling multiple emergency numbers
    const sosNumbers = ["112", "199", "+234-9-460-1000"];
    console.log("SOS triggered - calling:", sosNumbers);
  };

  return (
    <section className="container emergency">
      <div className="emergency-header">
        <h1 className="emergency-title">🚨 Emergency Contacts</h1>
        <p className="emergency-subtitle">Immediate help when you need it most</p>
      </div>

      {/* SOS Button */}
      <div className="sos-section">
        <button className="sos-button" onClick={handleSOS}>
          <span className="sos-pulse"></span>
          <span className="sos-text">SOS EMERGENCY</span>
          <span className="sos-subtext">Tap for immediate help</span>
        </button>
        <p className="sos-warning">Only use in life-threatening situations</p>
      </div>

      {/* National Emergency Contacts */}
      <div className="contacts-section">
        <h2>🇳🇬 National Emergency Numbers</h2>
        <div className="contacts-grid">
          {emergencyContacts.nigeria.map((contact, index) => (
            <div key={index} className={`contact-card ${contact.type}`}>
              <div className="contact-icon">
                {contact.type === 'police' && '👮'}
                {contact.type === 'fire' && '🚒'}
                {contact.type === 'ambulance' && '🚑'}
                {contact.type === 'traffic' && '🚦'}
              </div>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.description}</p>
              </div>
              <a href={`tel:${contact.number}`} className="call-button">
                📞 Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Emergency Lines */}
      <div className="contacts-section">
        <h2>🏥 Hospital Emergency Lines</h2>
        <div className="contacts-grid">
          {emergencyContacts.hospitals.map((contact, index) => (
            <div key={index} className={`contact-card ${contact.type}`}>
              <div className="contact-icon">
                {contact.type === 'hospital' && '🏥'}
                {contact.type === 'ngo' && '➕'}
              </div>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.description}</p>
              </div>
              <a href={`tel:${contact.number}`} className="call-button">
                📞 Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* International Emergency */}
      <div className="contacts-section">
        <h2>🌍 International Emergency</h2>
        <div className="contacts-grid">
          {emergencyContacts.international.map((contact, index) => (
            <div key={index} className={`contact-card ${contact.type}`}>
              <div className="contact-icon">
                {contact.type === 'embassy' && '🇺🇸'}
                {contact.type === 'quickmed' && '⚕️'}
              </div>
              <div className="contact-info">
                <h3>{contact.name}</h3>
                <p>{contact.description}</p>
              </div>
              <a href={`tel:${contact.number}`} className="call-button">
                📞 Call
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="emergency-instructions">
        <h3>📋 Emergency Instructions</h3>
        <div className="instructions-grid">
          <div className="instruction">
            <span className="instruction-number">1</span>
            <p><strong>Stay Calm</strong> - Take deep breaths and assess the situation</p>
          </div>
          <div className="instruction">
            <span className="instruction-number">2</span>
            <p><strong>Call Emergency</strong> - Dial 112 for immediate assistance</p>
          </div>
          <div className="instruction">
            <span className="instruction-number">3</span>
            <p><strong>Provide Location</strong> - Share your exact location with operator</p>
          </div>
          <div className="instruction">
            <span className="instruction-number">4</span>
            <p><strong>Follow Instructions</strong> - Listen carefully to emergency guidance</p>
          </div>
        </div>
      </div>

      <div className="emergency-footer">
        <Link href="/consult" className="btn btn-primary">
          💬 Quick Consultation
        </Link>
        <Link href="/book" className="btn btn-ghost">
          🏥 Book Hospital
        </Link>
      </div>
    </section>
  );
}