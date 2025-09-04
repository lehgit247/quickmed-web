"use client";
import { useMemo, useState } from "react";

const HOSPITALS = [
  {
    name: "CityCare Specialist Hospital",
    city: "Abuja",
    distanceKm: 3.2,
    phone: "0901 234 5678",
    services: ["Emergency", "Internal Medicine", "Surgery"],
    rating: 4.8,
  },
  {
    name: "Green Valley Medical Centre",
    city: "Lagos",
    distanceKm: 5.7,
    phone: "0902 111 2222",
    services: ["Pediatrics", "OB/GYN", "Diagnostics"],
    rating: 4.7,
  },
  {
    name: "Unity General Hospital",
    city: "Abuja",
    distanceKm: 7.9,
    phone: "0903 333 4444",
    services: ["General Practice", "Laboratory"],
    rating: 4.5,
  },
  {
    name: "Harborview Clinic",
    city: "Port Harcourt",
    distanceKm: 4.1,
    phone: "0904 555 6666",
    services: ["Emergency", "Orthopedics"],
    rating: 4.6,
  },
  {
    name: "Ikeja Family Hospital",
    city: "Lagos",
    distanceKm: 2.4,
    phone: "0905 777 8888",
    services: ["Family Medicine", "Pharmacy"],
    rating: 4.4,
  },
];

export default function BookPage() {
  const [city, setCity] = useState("");
  const [results, setResults] = useState(HOSPITALS);
  const [success, setSuccess] = useState(null);

  function search() {
    const term = city.trim().toLowerCase();
    if (!term) {
      setResults(HOSPITALS);
      return;
    }
    setResults(
      HOSPITALS.filter((h) => h.city.toLowerCase().includes(term))
    );
  }

  function book(h) {
    // pretend to book; show success screen
    setSuccess({
      name: h.name,
      city: h.city,
      phone: h.phone,
      ref: "QMC-" + Math.floor(100000 + Math.random() * 900000),
      eta: "~15–25 min",
    });
  }

  if (success) {
    return (
      <section className="container book">
        <div className="success">
          <img
            src="/quickmed-icon.png"
            alt=""
            style={{ width: 64, height: 64, display: "block", margin: "0 auto 10px" }}
          />
          <h2>Appointment Booked 🎉</h2>
          <p>
            <strong>{success.name}</strong> — {success.city}
          </p>
          <p>Reference: <strong>{success.ref}</strong></p>
          <p>Hospital Phone: <strong>{success.phone}</strong></p>
          <p>Estimated check-in time: <strong>{success.eta}</strong></p>

          <div className="row">
            <a href="/" className="btn btn-ghost">Back Home</a>
            <a href="/consult" className="btn btn-primary">Start a Consult</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container book">
      <h1 className="book-title">Find a Vetted Hospital</h1>

      <div className="search">
        <input
          placeholder="Type your city (e.g., Abuja, Lagos, Port Harcourt)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search}>Search</button>
      </div>

      <div className="hospitals">
        {results.map((h) => (
          <div key={h.name} className="h-card">
            <h3 className="h-name">{h.name}</h3>
            <p className="h-meta">
              {h.city} • ⭐ {h.rating} • {h.distanceKm} km away
            </p>
            <p className="h-meta">
              Services: {h.services.join(", ")}
            </p>
            <div className="h-actions">
              <a className="btn btn-ghost" href={`tel:${h.phone.replace(/\s/g, "")}`}>
                Call
              </a>
              <button className="btn btn-primary" onClick={() => book(h)}>
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
