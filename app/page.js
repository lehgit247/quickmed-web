import Image from "next/image";

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner container">
          <Image
            src="/quickmed-icon.png"           // your icon in /public
            alt="QuickMed Care"
            width={140}
            height={140}
            className="hero-logo"
            priority
          />

          <h1 className="hero-title">QuickMed Care</h1>

          <p className="hero-tagline">
            Instant Healthcare. Anywhere. Anytime.
          </p>

          <div className="cta-row">
            <a href="/consult" className="btn btn-primary">Get Started</a>
            <a href="/book" className="btn btn-ghost">Book Appointment</a>
          </div>
        </div>
      </section>

      {/* FEATURES (already had) */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-title">Instant Consults</div>
              <p className="feature-text">
                Chat, call, or video with licensed doctors in minutes—no queues.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-title">Verified Hospitals</div>
              <p className="feature-text">
                We partner only with vetted facilities for quality care.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-title">Real e-Prescriptions</div>
              <p className="feature-text">
                QR-code prescriptions accepted by pharmacies near you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hiw">
        <div className="container">
          <h2 className="hiw-title">How it works</h2>
          <div className="hiw-grid">
            <div className="hiw-card">
              <span className="hiw-step">Step 1</span>
              <div className="hiw-card-title">Tell us your symptoms</div>
              <p className="hiw-card-text">
                Open QuickMed Care and describe how you feel. We guide you with prompts to be clear and quick.
              </p>
            </div>

            <div className="hiw-card">
              <span className="hiw-step">Step 2</span>
              <div className="hiw-card-title">Instant doctor consult</div>
              <p className="hiw-card-text">
                Get connected to a licensed doctor for chat, call, or video—usually within minutes.
              </p>
            </div>

            <div className="hiw-card">
              <span className="hiw-step">Step 3</span>
              <div className="hiw-card-title">Prescription or booking</div>
              <p className="hiw-card-text">
                Receive a QR e-prescription or an auto-booked appointment at a vetted hospital if tests are needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <h2 className="testi-title">What people say</h2>
          <div className="testi-grid">
            <div className="testi-card">
              <p className="testi-quote">
                “I got a doctor within 5 minutes and a prescription right on my phone. No more waiting rooms!”
              </p>
              <p className="testi-author">— Amina, Abuja</p>
            </div>

            <div className="testi-card">
              <p className="testi-quote">
                “Traveling in a new city was stressful until QuickMed Care connected me to a vetted hospital.”
              </p>
              <p className="testi-author">— Daniel, Lagos</p>
            </div>

            <div className="testi-card">
              <p className="testi-quote">
                “The ambulance SOS and fast booking saved us precious time during an emergency.”
              </p>
              <p className="testi-author">— Nkechi, Port Harcourt</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
      {/* TRUSTED BY */}
      <section className="trusted">
        <div className="container">
          <p className="trusted-title">Trusted By Leading Healthcare Partners</p>
          <div className="trusted-logos">
            {/* Replace these placeholders with real logos later */}
           <Image src="/quickmed-icon.png" alt="Partner 1" width={48} height={48} />
<Image src="/quickmed-icon.png" alt="Partner 2" width={48} height={48} />
<Image src="/quickmed-icon.png" alt="Partner 3" width={48} height={48} />
<Image src="/quickmed-icon.png" alt="Partner 4" width={48} height={48} />
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <h2>Start your free consult today</h2>
          <p>Get instant access to doctors and verified hospitals near you.</p>
          <a href="/consult" className="cta-btn">Get Started Now</a>
        </div>
      </section>
