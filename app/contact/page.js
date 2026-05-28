"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { getTranslations } from "../i18n";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function onChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="container contact-page">
      <h1 className="contact-title">{t.contactUs}</h1>

      {!sent ? (
        <form onSubmit={handleSubmit} className="card contact-form">
          <label>
            {t.fullName}
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="e.g., Frank Eyam"
              required
            />
          </label>

          <label>
            {t.email}
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
            {t.yourMessage}
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
            <button type="submit" className="btn btn-primary">{t.sendMessage}</button>
          </div>
        </form>
      ) : (
        <div className="card">
          <div className="success-note">{t.thanksMessage}</div>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn btn-ghost" href="/">{t.backHome}</Link>
          </div>
        </div>
      )}
    </section>
  );
}
