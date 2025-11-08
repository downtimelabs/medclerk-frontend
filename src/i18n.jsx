import React, { createContext, useContext, useMemo } from 'react';

// Import English messages only
import { messages as enMessages } from './locales/en/messages';

const I18nContext = createContext({ t: (k) => k, lang: 'en' });

export function I18nProvider({ children }) {
  const value = useMemo(() => {
    const t = (key) => enMessages[key] || key;
    return { t, lang: 'en' };
  }, []);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}