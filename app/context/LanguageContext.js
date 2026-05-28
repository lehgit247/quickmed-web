// app/context/LanguageContext.js
"use client";
import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { languages } from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('quickmedLanguage');
    if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const selectedLanguage = languages.find((lang) => lang.code === language);
    localStorage.setItem('quickmedLanguage', language);
    document.documentElement.lang = language;
    document.documentElement.dir = selectedLanguage?.dir || 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
