import React, { createContext, useContext, useMemo } from 'react';

const translations = {
  en: {
    app_brand: 'AI Report Organizer',
    landing_title: 'Organize and understand your medical reports with AI',
    landing_sub: 'Securely upload, search, and chat with your health documents. Multilingual, fast, and privacy-first.',
    start_free: 'Start free',
    live_demo: 'Live demo',
    sign_in: 'Sign In',
    get_started: 'Get Started',
    select_language_title: 'Welcome to AI Report Organizer',
    select_language_sub: 'Please select your preferred language to continue',
    continue: 'Continue',
    auth_create_account: 'Create Account',
    auth_welcome_back: 'Welcome Back',
    auth_signup_sub: 'Sign up to start organizing your reports',
    auth_signin_sub: 'Sign in to your account',
    full_name: 'Full Name',
    email_address: 'Email Address',
    password: 'Password',
    confirm_password: 'Confirm Password',
    create_account: 'Create Account',
    sign_in_action: 'Sign In',
    upload_title: 'Upload Your Reports',
    upload_sub: 'Upload your medical reports, prescriptions, and documents for AI processing',
    upload_button: 'Upload & Process',
    dashboard_welcome: 'Welcome to your Dashboard',
    access: 'Access'
  },
  es: {
    app_brand: 'Organizador de Informes IA',
    landing_title: 'Organiza y entiende tus informes médicos con IA',
    landing_sub: 'Sube, busca y chatea con tus documentos de salud. Multilingüe, rápido y privado.',
    start_free: 'Empezar gratis',
    live_demo: 'Demo en vivo',
    sign_in: 'Iniciar sesión',
    get_started: 'Comenzar',
    select_language_title: 'Bienvenido a Organizador de Informes IA',
    select_language_sub: 'Selecciona tu idioma preferido para continuar',
    continue: 'Continuar',
    auth_create_account: 'Crear cuenta',
    auth_welcome_back: 'Bienvenido de nuevo',
    auth_signup_sub: 'Regístrate para organizar tus informes',
    auth_signin_sub: 'Inicia sesión en tu cuenta',
    full_name: 'Nombre completo',
    email_address: 'Correo electrónico',
    password: 'Contraseña',
    confirm_password: 'Confirmar contraseña',
    create_account: 'Crear cuenta',
    sign_in_action: 'Iniciar sesión',
    upload_title: 'Sube tus informes',
    upload_sub: 'Sube informes médicos, recetas y documentos para el procesamiento con IA',
    upload_button: 'Subir y procesar',
    dashboard_welcome: 'Bienvenido a tu Panel',
    access: 'Acceder'
  },
  hi: {
    app_brand: 'एआई रिपोर्ट आयोजक',
    landing_title: 'एआई के साथ अपनी मेडिकल रिपोर्ट व्यवस्थित करें और समझें',
    landing_sub: 'सुरक्षित रूप से अपनी स्वास्थ्य दस्तावेज़ अपलोड करें, खोजें और चैट करें। बहुभाषी, तेज़ और निजी।',
    start_free: 'फ्री शुरू करें',
    live_demo: 'लाइव डेमो',
    sign_in: 'साइन इन',
    get_started: 'शुरू करें',
    select_language_title: 'एआई रिपोर्ट आयोजक में आपका स्वागत है',
    select_language_sub: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
    continue: 'जारी रखें',
    auth_create_account: 'खाता बनाएं',
    auth_welcome_back: 'फिर मिलेंगे',
    auth_signup_sub: 'रिपोर्ट व्यवस्थित करना शुरू करने के लिए साइन अप करें',
    auth_signin_sub: 'अपने खाते में साइन इन करें',
    full_name: 'पूरा नाम',
    email_address: 'ईमेल पता',
    password: 'पासवर्ड',
    confirm_password: 'पासवर्ड की पुष्टि करें',
    create_account: 'खाता बनाएं',
    sign_in_action: 'साइन इन',
    upload_title: 'अपनी रिपोर्ट अपलोड करें',
    upload_sub: 'एआई प्रोसेसिंग के लिए रिपोर्ट, प्रिस्क्रिप्शन और दस्तावेज़ अपलोड करें',
    upload_button: 'अपलोड और प्रोसेस करें',
    dashboard_welcome: 'आपके डैशबोर्ड में स्वागत है',
    access: 'प्रवेश'
  },
  fr: {
    app_brand: "Organisateur d'Analyses IA",
    landing_title: 'Organisez et comprenez vos rapports médicaux avec l’IA',
    landing_sub: 'Téléchargez, recherchez et discutez avec vos documents de santé. Multilingue, rapide et privé.',
    start_free: 'Commencer',
    live_demo: 'Démo',
    sign_in: 'Se connecter',
    get_started: 'Démarrer',
    select_language_title: "Bienvenue dans l'Organisateur d'Analyses IA",
    select_language_sub: 'Veuillez sélectionner votre langue pour continuer',
    continue: 'Continuer',
    auth_create_account: 'Créer un compte',
    auth_welcome_back: 'Bon retour',
    auth_signup_sub: 'Inscrivez-vous pour organiser vos rapports',
    auth_signin_sub: 'Connectez-vous à votre compte',
    full_name: 'Nom complet',
    email_address: 'Adresse e-mail',
    password: 'Mot de passe',
    confirm_password: 'Confirmez le mot de passe',
    create_account: 'Créer un compte',
    sign_in_action: 'Se connecter',
    upload_title: 'Téléchargez vos rapports',
    upload_sub: 'Téléchargez vos rapports, ordonnances et documents pour l’IA',
    upload_button: 'Téléverser et traiter',
    dashboard_welcome: 'Bienvenue sur votre tableau de bord',
    access: 'Accéder'
  }
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


