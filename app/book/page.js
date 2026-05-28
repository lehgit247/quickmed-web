"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { getTranslations } from "../i18n";

const HOSPITALS = [
  { name: "CityCare Specialist Hospital", city: "Abuja", distanceKm: 3.2, phone: "0901 234 5678", services: ["Emergency", "Internal Medicine", "Surgery"], rating: 4.8 },
  { name: "Green Valley Medical Centre", city: "Lagos", distanceKm: 5.7, phone: "0902 111 2222", services: ["Pediatrics", "OB/GYN", "Diagnostics"], rating: 4.7 },
  { name: "Unity General Hospital", city: "Abuja", distanceKm: 7.9, phone: "0903 333 4444", services: ["General Practice", "Laboratory"], rating: 4.5 },
  { name: "Harborview Clinic", city: "Port Harcourt", distanceKm: 4.1, phone: "0904 555 6666", services: ["Emergency", "Orthopedics"], rating: 4.6 },
  { name: "Ikeja Family Hospital", city: "Lagos", distanceKm: 2.4, phone: "0905 777 8888", services: ["Family Medicine", "Pharmacy"], rating: 4.4 },
];

export default function BookPage() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [city, setCity] = useState("");
  const [results, setResults] = useState(HOSPITALS);
  const [success, setSuccess] = useState(null);

  function search() {
    const term = city.trim().toLowerCase();
    if (!term) {
      setResults(HOSPITALS);
      return;
    }
    setResults(HOSPITALS.filter((hospital) => hospital.city.toLowerCase().includes(term)));
  }

  function book(hospital) {
    setSuccess({
      name: hospital.name,
      city: hospital.city,
      phone: hospital.phone,
      ref: "QMC-" + Math.floor(100000 + Math.random() * 900000),
      eta: "~15-25 min",
    });
  }

  if (success) {
    return (
      <section className="container book">
        <div className="success">
          <Image
            src="/quickmed-icon.png"
            alt=""
            width={64}
            height={64}
            style={{ display: "block", margin: "0 auto 10px" }}
          />
          <h2>{t.appointmentBooked}</h2>
          <p><strong>{success.name}</strong> - {success.city}</p>
          <p>{t.reference}: <strong>{success.ref}</strong></p>
          <p>{t.hospitalPhone}: <strong>{success.phone}</strong></p>
          <p>{t.estimatedCheckIn}: <strong>{success.eta}</strong></p>

          <div className="row">
            <Link href="/" className="btn btn-ghost">{t.backHome}</Link>
            <Link href="/consult" className="btn btn-primary">{t.startConsult}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container book">
      <h1 className="book-title">{t.findHospital}</h1>

      <div className="search">
        <input
          placeholder={t.cityPlaceholder}
          value={city}
          onChange={(event) => setCity(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && search()}
        />
        <button onClick={search}>{t.search}</button>
      </div>

      <div className="hospitals">
        {results.map((hospital) => (
          <div key={hospital.name} className="h-card">
            <h3 className="h-name">{hospital.name}</h3>
            <p className="h-meta">
              {hospital.city} - {hospital.rating} - {hospital.distanceKm} {t.kmAway}
            </p>
            <p className="h-meta">{t.services}: {hospital.services.join(", ")}</p>
            <div className="h-actions">
              <a className="btn btn-ghost" href={`tel:${hospital.phone.replace(/\s/g, "")}`}>{t.call}</a>
              <button className="btn btn-primary" onClick={() => book(hospital)}>{t.bookAppointment}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
