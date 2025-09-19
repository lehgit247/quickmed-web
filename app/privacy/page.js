export const metadata = {
  title: "Privacy Policy — QuickMed Care",
  description: "How we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <section className="container" style={{ padding: "32px 0 60px" }}>
      <h1 style={{ fontWeight: 800, margin: 0, fontSize: "clamp(22px,4vw,36px)" }}>
        Privacy Policy
      </h1>
      <p style={{ color: "#4b5563" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <p>
        We respect your privacy. QuickMed Care collects only the information necessary to
        provide consultations, bookings, and e-prescriptions. We never sell your personal data.
      </p>
      <h3>What we collect</h3>
      <ul>
        <li>Basic account info (name, email) you provide</li>
        <li>Consultation details you submit (symptoms, city)</li>
        <li>Technical data (cookies/analytics) to improve the service</li>
      </ul>
      <h3>How we use it</h3>
      <ul>
        <li>To connect you with licensed doctors</li>
        <li>To book vetted hospitals when needed</li>
        <li>To improve performance and reliability</li>
      </ul>
      <h3>Contact</h3>
      <p>
        Questions? Email <a href="mailto:hello@quickmed.care">hello@quickmed.care</a>
      </p>
    </section>
  );
}
