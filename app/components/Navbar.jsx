"use client";

import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo & Brand */}
        <Link className="nav-logo" href="/">
          <Image
            src="/quickmed-icon.png"
            alt="QuickMed Care"
            width={28}
            height={28}
          />
          <span className="brand">QuickMed Care</span>
        </Link>

        {/* Desktop Links */}
        <nav className="nav-links desktop">
          <Link href="/">Home</Link>
          <Link href="/consult">Consult</Link>
          <Link href="/book">Book</Link>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Hamburger button for small screens */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Slide-down mobile menu */}
      {menuOpen && (
        <nav className="mobile-menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/consult" onClick={() => setMenuOpen(false)}>Consult</Link>
          <Link href="/book" onClick={() => setMenuOpen(false)}>Book</Link>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      )}
    </header>
  );
}
