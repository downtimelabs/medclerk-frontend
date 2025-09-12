import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { FaGlobe, FaArrowRight } from 'react-icons/fa';
import './LanguageSelection.css';

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
    <div className="language-selection">
      <div className="main-content">
        <div className="page-container">
          <div className="header">
            <div className="icon-container">
              <FaGlobe className="globe-icon" />
            </div>
            <h1>{t('select_language_title')}</h1>
            <p>{t('select_language_sub')}</p>
          </div>

          <div className="card">
            <div className="language-grid">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${
                    selectedLang === language.code ? 'selected' : ''
                  }`}
                  onClick={() => handleLanguageSelect(language.code)}
                >
                  <span className="flag">{language.flag}</span>
                  <span className="name">{language.name}</span>
                </button>
              ))}
            </div>

            <div className="continue-section">
              <button
                className={`btn btn-primary continue-btn ${
                  !selectedLang ? 'disabled' : ''
                }`}
                onClick={handleContinue}
                disabled={!selectedLang || isLoading}
              >
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  <>
                    <span>{t('continue')}</span>
                    <FaArrowRight className="arrow-icon" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="footer-info">
            <p>You can change your language preference later in settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
