"use client";

import { useLanguage } from '../context/LanguageContext';
import { getTranslations } from '../i18n';

export default function Footer() {
  const { language } = useLanguage();
  const t = getTranslations(language);

  return (
    <footer className="site-footer" id="about">
      <div className="footer-inner">
        <h3>{t.aboutTitle}</h3>
        <p>{t.aboutText}</p>
        <div id="contact" className="contact">
          <strong>{t.contactLabel}</strong> hello@quickmed-care.com
        </div>
      </div>
    </footer>
  );
}
