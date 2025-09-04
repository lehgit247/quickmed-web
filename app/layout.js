import "./globals.css"; // keep this at the top so CSS loads

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
            <a className="nav-logo" href="/">
              <img src="/quickmed-icon.png" alt="QuickMed Care" />
              <span className="brand">QuickMed Care</span>
            </a>

            {/* 1) hidden checkbox to control menu (CSS-only) */}
            <input id="nav-toggle" type="checkbox" className="nav-toggle" />

            {/* 2) hamburger button (label toggles the checkbox) */}
            <label htmlFor="nav-toggle" className="hamburger" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </label>

            {/* 3) links (will open/close on small screens) */}
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/consult">Consult</a>
              <a href="/book">Book</a>
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
