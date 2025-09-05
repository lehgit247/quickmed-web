import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "QuickMed Care",
  description: "Instant Healthcare. Anywhere. Anytime.",
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
