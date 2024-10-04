import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './en.json';

/**
 * This function initializes the i18next library with the English translations and default configuration.
 * It sets up the internationalization framework for the entire application.
 * 
 * @returns {i18n} The initialized i18next instance
 */
export const initializeI18n = (): typeof i18n => {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslations
        }
      },
      lng: 'en', // Set default language to English
      fallbackLng: 'en', // Use English as fallback
      interpolation: {
        escapeValue: false // React already safes from XSS
      },
      defaultNS: 'translation', // Use 'translation' as the default namespace
      ns: ['translation'], // Define available namespaces
      keySeparator: '.', // Use dot notation for nested translations
      debug: process.env.NODE_ENV === 'development' // Enable debug mode in development
    });

  return i18n;
};

// Export the initialized i18n instance as default
export default initializeI18n();

/**
 * This file addresses the following requirement:
 * Requirement: Internationalization
 * Location: Technical Specification/1.1 System Objectives/Quantifiable Networking
 * Description: Provide support for multiple languages, starting with English
 */