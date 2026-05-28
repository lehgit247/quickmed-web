"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from './context/LanguageContext';
import { getTranslations } from './i18n';

export default function Page() {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <>
      <section className="hero">
        <div className="hero-inner container">
          <Image
            src="/quickmed-icon.png"
            alt={t.quickMedCare}
            width={140}
            height={140}
            className="hero-logo"
            priority
          />

          <h1 className="hero-title">{t.quickMedCare}</h1>
          <p className="hero-tagline">{t.heroTagline}</p>

          <div className="cta-row">
            <Link href="/consult" className="btn btn-primary">{t.getStarted}</Link>
            <Link href="/book" className="btn btn-ghost">{t.bookAppointment}</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-title">{t.instantConsults}</div>
              <p className="feature-text">{t.instantConsultsText}</p>
            </div>

            <div className="feature-card">
              <div className="feature-title">{t.verifiedHospitals}</div>
              <p className="feature-text">{t.verifiedHospitalsText}</p>
            </div>

            <div className="feature-card">
              <div className="feature-title">{t.realPrescriptions}</div>
              <p className="feature-text">{t.realPrescriptionsText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw">
        <div className="container">
          <h2 className="hiw-title">{t.howItWorks}</h2>
          <div className="hiw-grid">
            <div className="hiw-card">
              <span className="hiw-step">{t.step1}</span>
              <div className="hiw-card-title">{t.tellSymptoms}</div>
              <p className="hiw-card-text">{t.tellSymptomsText}</p>
            </div>

            <div className="hiw-card">
              <span className="hiw-step">{t.step2}</span>
              <div className="hiw-card-title">{t.doctorConsult}</div>
              <p className="hiw-card-text">{t.doctorConsultText}</p>
            </div>

            <div className="hiw-card">
              <span className="hiw-step">{t.step3}</span>
              <div className="hiw-card-title">{t.prescriptionOrBooking}</div>
              <p className="hiw-card-text">{t.prescriptionOrBookingText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2 className="testi-title">{t.whatPeopleSay}</h2>
          <div className="testi-grid">
            <div className="testi-card">
              <p className="testi-quote">{t.testimonial1}</p>
              <p className="testi-author">Amina, Abuja</p>
            </div>
            <div className="testi-card">
              <p className="testi-quote">{t.testimonial2}</p>
              <p className="testi-author">Daniel, Lagos</p>
            </div>
            <div className="testi-card">
              <p className="testi-quote">{t.testimonial3}</p>
              <p className="testi-author">Nkechi, Port Harcourt</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trusted">
        <div className="container">
          <p className="trusted-title">{t.trustedPartners}</p>
          <div className="trusted-logos">
            {[1, 2, 3, 4].map((partner) => (
              <Image
                key={partner}
                src="/quickmed-icon.png"
                alt={`Partner ${partner}`}
                width={48}
                height={48}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <Link href="/consult" className="cta-btn">{t.getStartedNow}</Link>
        </div>
      </section>
    </>
  );
}
