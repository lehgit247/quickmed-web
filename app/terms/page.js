export const metadata = {
  title: "Terms of Service — QuickMed Care",
  description: "The rules for using QuickMed Care.",
};

export default function TermsPage() {
  return (
    <section className="container" style={{ padding: "32px 0 60px" }}>
      <h1 style={{ fontWeight: 800, margin: 0, fontSize: "clamp(22px,4vw,36px)" }}>
        Terms of Service
      </h1>
      <p style={{ color: "#4b5563" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <h3>Use of Service</h3>
      <p>
        QuickMed Care provides instant consultations, e-prescriptions, and hospital booking.
        It is not a substitute for emergency care. In emergencies, call local services immediately.
      </p>
      <h3>User Responsibilities</h3>
      <ul>
        <li>Provide accurate information during consultations and bookings.</li>
        <li>Follow medical advice from licensed professionals.</li>
        <li>Do not misuse or attempt to interfere with the service.</li>
      </ul>
      <h3>Liability</h3>
      <p>
        While we partner with vetted providers, QuickMed Care is not responsible for outcomes
        of third-party medical services. Your use of the service is at your discretion.
      </p>
      <h3>Contact</h3>
      <p>
        Questions? Email <a href="mailto:hello@quickmed.care">hello@quickmed.care</a>
      </p>
    </section>
  );
}
