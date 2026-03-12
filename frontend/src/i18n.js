import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zhCNTranslation from './locales/zh_CN.json';
import zhTWTranslation from './locales/zh_TW.json';
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';
import bnTranslation from './locales/bn.json';
import deTranslation from './locales/de.json';
import esTranslation from './locales/es.json';
import faTranslation from './locales/fa.json';
import frTranslation from './locales/fr.json';
import heTranslation from './locales/he.json';
import hiTranslation from './locales/hi.json';
import idTranslation from './locales/id.json';
import itTranslation from './locales/it.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';
import msTranslation from './locales/ms.json';
import nlTranslation from './locales/nl.json';
import plTranslation from './locales/pl.json';
import ptTranslation from './locales/pt.json';
import ptBRTranslation from './locales/pt_BR.json';
import ruTranslation from './locales/ru.json';
import swTranslation from './locales/sw.json';
import taTranslation from './locales/ta.json';
import thTranslation from './locales/th.json';
import tlTranslation from './locales/tl.json';
import trTranslation from './locales/tr.json';
import ukTranslation from './locales/uk.json';
import urTranslation from './locales/ur.json';
import viTranslation from './locales/vi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh_CN: { translation: zhCNTranslation },
      zh_TW: { translation: zhTWTranslation },
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
      bn: { translation: bnTranslation },
      de: { translation: deTranslation },
      es: { translation: esTranslation },
      fa: { translation: faTranslation },
      fr: { translation: frTranslation },
      he: { translation: heTranslation },
      hi: { translation: hiTranslation },
      id: { translation: idTranslation },
      it: { translation: itTranslation },
      ja: { translation: jaTranslation },
      ko: { translation: koTranslation },
      ms: { translation: msTranslation },
      nl: { translation: nlTranslation },
      pl: { translation: plTranslation },
      pt: { translation: ptTranslation },
      pt_BR: { translation: ptBRTranslation },
      ru: { translation: ruTranslation },
      sw: { translation: swTranslation },
      ta: { translation: taTranslation },
      th: { translation: thTranslation },
      tl: { translation: tlTranslation },
      tr: { translation: trTranslation },
      uk: { translation: ukTranslation },
      ur: { translation: urTranslation },
      vi: { translation: viTranslation },
    },
    fallbackLng: 'zh_CN',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
