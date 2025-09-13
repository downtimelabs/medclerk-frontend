import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { FaGlobe, FaArrowRight } from 'react-icons/fa';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

const LanguageSelection = ({ onLanguageSelect }) => {
  const [selectedLang, setSelectedLang] = useState('');
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLang(languageCode);
  };

  const handleContinue = async () => {
    if (!selectedLang) return;
    
    setIsLoading(true);
    
    // Simulate API call or processing
    setTimeout(() => {
      onLanguageSelect(selectedLang);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-main flex flex-col text-dark-300">
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <FaGlobe className="text-6xl text-primary-500 opacity-90" />
            </div>
            <h1 className="text-4xl font-bold mb-3 text-white">
              {t('select_language_title')}
            </h1>
            <p className="text-lg text-dark-400">
              {t('select_language_sub')}
            </p>
          </div>

          <div className="card">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`flex flex-col items-center p-5 border border-white/10 rounded-xl bg-white/5 cursor-pointer transition-all duration-300 text-sm font-medium text-dark-300 hover:border-primary-500 hover:-translate-y-0.5 hover:shadow-lg hover:bg-white/8 ${
                    selectedLang === language.code 
                      ? 'border-primary-500 bg-primary-500 text-white -translate-y-0.5 shadow-lg' 
                      : ''
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className="text-3xl mb-2">{language.flag}</span>
                  <span className="font-semibold">{language.name}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                className={`btn btn-primary min-w-48 flex items-center justify-center gap-2.5 text-base py-4 px-8 ${
                  !selectedLang ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                onClick={handleContinue}
                disabled={!selectedLang || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2.5">
                    <div className="spinner"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  <>
                    <span>{t('continue')}</span>
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-dark-500 text-sm">
              You can change your language preference later in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
