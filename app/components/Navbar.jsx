"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useLanguage } from '../context/LanguageContext';
import { getTranslations, languages } from '../i18n';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="language-select"
        aria-label="Select language"
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
  const { language } = useLanguage();
  const t = getTranslations(language);

  const links = [
    { href: '/', label: t.home },
    { href: '/consult', label: t.consult },
    { href: '/travel', label: t.travel },
    { href: '/book', label: t.book },
    { href: '/emergency', label: t.emergency },
    { href: '/contact', label: t.contact }
  ];

  return (
    <header>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          {t.quickMedCare}
        </Link>

        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
          <LanguageSwitcher />
        </div>

        <div className="mobile-language-top">
          <LanguageSwitcher />
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX color="black" /> : <FiMenu color="black" />}
        </button>

        {menuOpen && (
          <div className="mobile-menu">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mobile-language">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
