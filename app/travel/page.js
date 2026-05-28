"use client";
import { useState } from "react";
import { useLanguage } from '../context/LanguageContext';
import { getTranslations } from '../i18n';

// 🎯 Let's add travel words to our language dictionary
const travelTranslations = {
  en: {
    travel: "Travel & Stay",
    bookFlights: "Book Flights",
    findHotels: "Find Hotels", 
    medicalTourism: "Medical Tourism",
    airportTaxis: "Airport Taxis",
    travelPackages: "Travel Packages",
    // ... add all the travel words here
  },
  fr: {
    travel: "Voyage & Séjour",
    bookFlights: "Réserver Vols",
    findHotels: "Trouver Hôtels",
    // ... French travel words
  },
  es: {
    travel: "Viajar & Alojarse", 
    bookFlights: "Reservar Vuelos",
    findHotels: "Encontrar Hoteles",
    // ... Spanish travel words
  }
};

export default function TravelPage() {
  const { language } = useLanguage();
  const t = {
    ...travelTranslations.en,
    ...getTranslations(language),
    ...(travelTranslations[language] || {})
  };
  
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <section className="container travel-page">
      {/* 🎪 Big Beautiful Header */}
      <div className="travel-hero">
        <h1>🌍 Your Complete Travel Solution</h1>
        <p>Flights, Hotels, Medical Tourism & More - All in One Place!</p>
      </div>

      {/* 🎯 Navigation Tabs */}
      <div className="travel-tabs">
        <button 
          className={activeTab === "flights" ? "active" : ""}
          onClick={() => setActiveTab("flights")}
        >
          ✈️ {t.bookFlights}
        </button>
        <button 
          className={activeTab === "hotels" ? "active" : ""}
          onClick={() => setActiveTab("hotels")}
        >
          🏨 {t.findHotels}
        </button>
        <button 
          className={activeTab === "medical" ? "active" : ""}
          onClick={() => setActiveTab("medical")}
        >
          🏥 {t.medicalTourism}
        </button>
        <button 
          className={activeTab === "taxis" ? "active" : ""}
          onClick={() => setActiveTab("taxis")}
        >
          🚕 {t.airportTaxis}
        </button>
        <button 
          className={activeTab === "packages" ? "active" : ""}
          onClick={() => setActiveTab("packages")}
        >
          📦 {t.travelPackages}
        </button>
      </div>

      {/* 🏠 The Magic House - Content Changes Based on Tab */}
      <div className="travel-content">
        {activeTab === "flights" && <FlightSearch />}
        {activeTab === "hotels" && <HotelSearch />}
        {activeTab === "medical" && <MedicalTourism />}
        {activeTab === "taxis" && <AirportTaxis />}
        {activeTab === "packages" && <TravelPackages />}
      </div>

      {/* 💎 Premium Membership Section */}
      <div className="premium-section">
        <h2>✨ Go Premium - Save More!</h2>
        <div className="premium-cards">
          <div className="premium-card">
            <h3>🥉 Basic</h3>
            <p>Free Forever</p>
            <ul>
              <li>✓ Basic Travel Booking</li>
              <li>✓ Standard Prices</li>
            </ul>
          </div>
          <div className="premium-card featured">
            <h3>🥈 Premium</h3>
            <p>₦5,000/month</p>
            <ul>
              <li>✓ 5% Discount on All Bookings</li>
              <li>✓ Free Travel Insurance</li>
              <li>✓ Priority Support</li>
            </ul>
            <button className="btn btn-primary">Get Premium</button>
          </div>
          <div className="premium-card">
            <h3>🥇 Executive</h3>
            <p>₦15,000/month</p>
            <ul>
              <li>✓ 15% Discount on All Bookings</li>
              <li>✓ Premium Travel Insurance</li>
              <li>✓ Personal Concierge</li>
              <li>✓ Airport Lounge Access</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 🛩️ Flight Search Component
function FlightSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="search-card">
      <h2>✈️ Find Your Perfect Flight</h2>
      <div className="search-form">
        <input 
          type="text" 
          placeholder="From (City or Airport)" 
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="To (City or Airport)" 
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className="btn btn-primary">Search Flights</button>
      </div>
      
      {/* 🎯 Quick Destination Suggestions */}
      <div className="quick-destinations">
        <h3>Popular Medical Destinations</h3>
        <div className="destination-cards">
          <div className="destination-card">
            <span>🇮🇳</span>
            <p>India</p>
            <small>Affordable treatments</small>
          </div>
          <div className="destination-card">
            <span>🇹🇷</span>
            <p>Turkey</p>
            <small>Quality healthcare</small>
          </div>
          <div className="destination-card">
            <span>🇿🇦</span>
            <p>South Africa</p>
            <small>Advanced facilities</small>
          </div>
          <div className="destination-card">
            <span>🇺🇸</span>
            <p>USA</p>
            <small>Specialist care</small>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🏨 Hotel Search Component  
function HotelSearch() {
  return (
    <div className="search-card">
      <h2>🏨 Find Your Perfect Stay</h2>
      <div className="search-form">
        <input type="text" placeholder="Where are you going?" />
        <input type="date" placeholder="Check-in" />
        <input type="date" placeholder="Check-out" />
        <select>
          <option>1 Room, 2 Adults</option>
          <option>1 Room, 1 Adult</option>
          <option>2 Rooms, 4 Adults</option>
        </select>
        <button className="btn btn-primary">Search Hotels</button>
      </div>
      
      {/* 🏥 Medical-Friendly Hotels */}
      <div className="special-features">
        <h3>🏥 Medical-Friendly Stays</h3>
        <div className="feature-grid">
          <div className="feature">
            <span>♿</span>
            <p>Accessible Rooms</p>
          </div>
          <div className="feature">
            <span>🍲</span>
            <p>Special Diets</p>
          </div>
          <div className="feature">
            <span>🏥</span>
            <p>Near Hospitals</p>
          </div>
          <div className="feature">
            <span>🚗</span>
            <p>Airport Transfer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🏥 Medical Tourism Component
function MedicalTourism() {
  return (
    <div className="medical-tourism">
      <h2>🏥 All-in-One Medical Tourism</h2>
      <p>Treatment + Travel + Accommodation = One Package</p>
      
      <div className="medical-packages">
        <div className="package-card">
          <h3>❤️ Heart Treatment Package</h3>
          <p>India • 2 Weeks</p>
          <div className="package-includes">
            <span>✓ Hospital Treatment</span>
            <span>✓ Return Flights</span>
            <span>✓ Hotel Stay</span>
            <span>✓ Local Transport</span>
          </div>
          <button className="btn btn-primary">View Package</button>
        </div>
        
        <div className="package-card">
          <h3>🦷 Dental Care Package</h3>
          <p>Turkey • 1 Week</p>
          <div className="package-includes">
            <span>✓ Dental Procedures</span>
            <span>✓ Return Flights</span>
            <span>✓ Hotel Stay</span>
            <span>✓ Aftercare</span>
          </div>
          <button className="btn btn-primary">View Package</button>
        </div>
        
        <div className="package-card">
          <h3>👁️ Eye Surgery Package</h3>
          <p>South Africa • 10 Days</p>
          <div className="package-includes">
            <span>✓ Laser Surgery</span>
            <span>✓ Return Flights</span>
            <span>✓ Hotel Stay</span>
            <span>✓ Follow-up</span>
          </div>
          <button className="btn btn-primary">View Package</button>
        </div>
      </div>
    </div>
  );
}

// 🚕 Airport Taxis Component
function AirportTaxis() {
  return (
    <div className="taxis-section">
      <h2>🚕 Reliable Airport Transfers</h2>
      <div className="taxi-options">
        <div className="taxi-card">
          <h3>🚗 Standard Taxi</h3>
          <p>Comfortable & Affordable</p>
          <button className="btn">Book Now</button>
        </div>
        <div className="taxi-card">
          <h3>🚙 Medical Transport</h3>
          <p>Wheelchair accessible</p>
          <button className="btn">Book Now</button>
        </div>
        <div className="taxi-card">
          <h3>🚐 Group Transfer</h3>
          <p>For families & groups</p>
          <button className="btn">Book Now</button>
        </div>
      </div>
    </div>
  );
}

// 📦 Travel Packages Component
function TravelPackages() {
  return (
    <div className="packages-section">
      <h2>📦 Curated Travel Experiences</h2>
      <div className="package-types">
        <div className="package-type">
          <h3>🌴 Wellness Retreat</h3>
          <p>Relax & Rejuvenate</p>
        </div>
        <div className="package-type">
          <h3>🩺 Health Check-up</h3>
          <p>Comprehensive medical tests</p>
        </div>
        <div className="package-type">
          <h3>👨‍👩‍👧‍👦 Family Medical</h3>
          <p>Healthcare for the whole family</p>
        </div>
      </div>
    </div>
  );
}
