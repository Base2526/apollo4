import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en_US from '@/locales/en_US.json';
import th_TH from '@/locales/th_TH.json';

i18n.use(initReactI18next).init({
  resources: {
    en_US: {
      translation: en_US,
    },
    th_TH: {
      translation: th_TH,
    },
  },
  lng: 'en_US', // Default language
  fallbackLng: 'en_US', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
