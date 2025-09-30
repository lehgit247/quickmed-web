// app/components/Navbar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link className="nav-logo" href="/">
          <Image src="/quickmed-icon.png" alt="QuickMed Care" width={28} height={28} />
          <span className="brand">QuickMed Care</span>
        </Link>

        {/* Desktop links */}
        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/consult">Consult</Link>
          <Link href="/book">Book</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/consult" onClick={() => setMenuOpen(false)}>Consult</Link>
          <Link href="/book" onClick={() => setMenuOpen(false)}>Book</Link>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  );
}
