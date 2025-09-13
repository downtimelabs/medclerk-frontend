import React, { createContext, useContext, useMemo } from 'react';

// Import message files
import { messages as enMessages } from './locales/en/messages';
import { messages as esMessages } from './locales/es/messages';
import { messages as hiMessages } from './locales/hi/messages';
import { messages as frMessages } from './locales/fr/messages';

const translations = {
  en: enMessages,
  es: esMessages,
  hi: hiMessages,
  fr: frMessages,
};

const I18nContext = createContext({ t: (k) => k, lang: 'en' });

export function I18nProvider({ lang, children }) {
  const value = useMemo(() => {
    const dict = translations[lang] || translations.en;
    const t = (key) => dict[key] || translations.en[key] || key;
    return { t, lang };
  }, [lang]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}