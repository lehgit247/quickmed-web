import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
  description: "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals near you.",
  metadataBase: new URL("https://quickmed-web-zpjc.vercel.app"), // change to your final domain later
  openGraph: {
    title: "QuickMed Care — Instant Healthcare. Anywhere. Anytime.",
    description: "Consult licensed doctors in minutes, get real e-prescriptions, and book vetted hospitals.",
    url: "https://quickmed-web-zpjc.vercel.app",
    siteName: "QuickMed Care",
    images: ["/og-image.png"], // we’ll create this next
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
        {/* ===== NAVBAR ===== */}
        <header className="navbar">
          <div className="nav-container">
            {/* left: logo + brand */}
            <Link className="nav-logo" href="/">
              {/* small icon in navbar */}
              <Image src="/quickmed-icon.png" alt="QuickMed Care" width={28} height={28} />
              <span className="brand">QuickMed Care</span>
            </Link>

            {/* links on the right */}
            <nav className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/consult">Consult</Link>
              <Link href="/book">Book</Link>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        {/* page content */}
        <main className="page-content">{children}</main>

        {/* footer anchors for About / Contact */}
        <footer className="site-footer" id="about">
          <div className="footer-inner">
            <h3>About QuickMed Care</h3>
            <p>
              Fast consultations, trusted hospitals, and real e-prescriptions.
              Built for travelers and locals who want care without the wait.
            </p>

            <div id="contact" className="contact">
              <strong>Contact:</strong> hello@quickmed.care
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
