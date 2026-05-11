import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'ENG' | 'AR';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ENG');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div dir={language === 'AR' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};