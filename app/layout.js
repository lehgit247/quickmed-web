import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
  description:
    "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals near you.",
  metadataBase: new URL("https://quickmed-web-zpjc.vercel.app"),
  openGraph: {
    title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
    description:
      "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals.",
    url: "https://quickmed-web-zpjc.vercel.app",
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
  // 👇 NEW: tell browsers which icons to use
  icons: {
    icon: [{ url: "/icon.png" }],           // your 512×512 PNG inside app/
    apple: [{ url: "/apple-icon.png" }],    // your 180×180 PNG inside app/
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ===== NAVBAR ===== */}
        <header className="navbar">
          <div className="nav-container">
            {/* left: logo + brand */}
            <Link className="nav-logo" href="/">
              <Image src="/quickmed-icon.png" alt="QuickMed Care" width={28} height={28} />
              <span className="brand">QuickMed Care</span>
            </Link>

            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/consult">Consult</Link>
              <Link href="/book">Book</Link>
              <a href="#about">About</a>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>

        {/* page content */}
        <main className="page-content">{children}</main>

        {/* ===== FOOTER ===== */}
        <footer className="site-footer" id="about">
          <div className="footer-inner">
            <h3>About QuickMed Care</h3>
            <p>
              Fast consultations, trusted hospitals, and real e-prescriptions.
              Built for travelers and locals who want care without the wait.
            </p>

            <div id="contact" className="contact">
              <strong>Contact:</strong>{" "}
              <a href="mailto:hello@quickmed.care">hello@quickmed.care</a>
              {" · "}
              <Link href="/privacy">Privacy</Link>
              {" · "}
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
