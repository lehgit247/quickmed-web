"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

// Simple language switcher component
function LanguageSwitcher() {
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
  ];

  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <header>
      {/* Desktop Nav */}
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          QuickMed Care
        </Link>
        
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/consult">Consult</Link>
          <Link href="/book">Book</Link>
          <Link href="/emergency">🚨 Emergency</Link>
          <Link href="/contact">Contact</Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX color="black" /> : <FiMenu color="black" />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/consult" onClick={() => setMenuOpen(false)}>Consult</Link>
            <Link href="/book" onClick={() => setMenuOpen(false)}>Book</Link>
            <Link href="/emergency" onClick={() => setMenuOpen(false)}>🚨 Emergency</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <div className="mobile-language">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}