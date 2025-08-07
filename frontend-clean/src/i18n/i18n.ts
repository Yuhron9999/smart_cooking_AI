import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Fix TypeScript lỗi với i18next-browser-languagedetector
declare module 'i18next-browser-languagedetector' {
  interface DetectorOptions {
    lookupQuerystring?: string;
    lookupCookie?: string;
    lookupLocalStorage?: string;
    lookupFromPathIndex?: number;
    lookupFromSubdomainIndex?: number;
    caches?: string[];
    excludeCacheFor?: string[];
    cookieMinutes?: number;
    cookieDomain?: string;
    cookieExpirationDate?: Date;
    cookieSameSite?: string;
    htmlTag?: HTMLElement;
    checkWhitelist?: boolean;
    convertDetectedLanguage?: (lng: string) => string;
  }
  
  const languageDetector: any;
  export = languageDetector;
}

// Import các tệp ngôn ngữ
import enCommon from './locales/en/common.json';
import viCommon from './locales/vi/common.json';

// Cấu hình i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon
      },
      vi: {
        common: viCommon
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    ns: ['common'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // không cần escape với React
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;
