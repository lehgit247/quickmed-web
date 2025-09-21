"use client";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Demo: pretend we sent it. Later we can wire an API/email.
    setSent(true);
  }

  return (
    <section className="container contact-page">
      <h1 className="contact-title">Contact Us</h1>

      {!sent ? (
        <form onSubmit={handleSubmit} className="card contact-form">
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Frank Eyam"
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="e.g., hello@quickmed.care"
              required
            />
          </label>

          <label>
            Your message
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={onChange}
              placeholder="How can we help?"
              required
            />
          </label>

          <div className="row">
            <button type="submit" className="btn btn-primary">Send Message</button>
          </div>
        </form>
      ) : (
        <div className="card">
          <div className="success-note">
            ✅ Thank you! Your message has been received. We’ll get back to you shortly.
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn btn-ghost" href="/">Back Home</Link>
          </div>
        </div>
      )}
    </section>
  );
}
