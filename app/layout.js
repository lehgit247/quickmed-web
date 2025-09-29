import FloatingCallButton from "./components/FloatingCallButton";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
  description:
    "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals near you.",
  metadataBase: new URL("https://quickmed-care.com"),
  openGraph: {
    title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
    description:
      "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals.",
    url: "https://quickmed-care.com",
    siteName: "QuickMed Care",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickMed Care",
    description: "Instant Healthcare. Anywhere. Anytime.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
<FloatingCallButton />

        <main className="page-content">{children}</main>

        <footer className="site-footer" id="about">
          <div className="footer-inner">
            <h3>About QuickMed Care</h3>
            <p>
              Fast consultations, trusted hospitals, and real e-prescriptions.
              Built for travelers and locals who want care without the wait.
            </p>

            <div id="contact" className="contact">
              <strong>Contact:</strong> hello@quickmed-care.com
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
