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
import { isSuspiciousTranslation } from './utils/safeTranslation';

function sanitizeLocale(locale, fallback, localeName) {
  if (!locale || typeof locale !== 'object') {
    return locale;
  }

  if (Array.isArray(locale)) {
    return locale.map((item, index) => sanitizeLocale(item, fallback?.[index], localeName));
  }

  const result = {};

  for (const [key, value] of Object.entries(locale)) {
    const fallbackValue = fallback?.[key];

    if (value && typeof value === 'object') {
      result[key] = sanitizeLocale(value, fallbackValue, localeName);
      continue;
    }

    result[key] = isSuspiciousTranslation(value, localeName) && typeof fallbackValue === 'string'
      ? fallbackValue
      : value;
  }

  return result;
}

const sanitizedResources = {
  zh_CN: zhCNTranslation,
  zh_TW: zhTWTranslation,
  en: enTranslation,
  ar: sanitizeLocale(arTranslation, enTranslation, 'ar'),
  bn: sanitizeLocale(bnTranslation, enTranslation, 'bn'),
  de: sanitizeLocale(deTranslation, enTranslation, 'de'),
  es: sanitizeLocale(esTranslation, enTranslation, 'es'),
  fa: sanitizeLocale(faTranslation, enTranslation, 'fa'),
  fr: sanitizeLocale(frTranslation, enTranslation, 'fr'),
  he: sanitizeLocale(heTranslation, enTranslation, 'he'),
  hi: sanitizeLocale(hiTranslation, enTranslation, 'hi'),
  id: sanitizeLocale(idTranslation, enTranslation, 'id'),
  it: sanitizeLocale(itTranslation, enTranslation, 'it'),
  ja: sanitizeLocale(jaTranslation, enTranslation, 'ja'),
  ko: sanitizeLocale(koTranslation, enTranslation, 'ko'),
  ms: sanitizeLocale(msTranslation, enTranslation, 'ms'),
  nl: sanitizeLocale(nlTranslation, enTranslation, 'nl'),
  pl: sanitizeLocale(plTranslation, enTranslation, 'pl'),
  pt: sanitizeLocale(ptTranslation, enTranslation, 'pt'),
  pt_BR: sanitizeLocale(ptBRTranslation, enTranslation, 'pt_BR'),
  ru: sanitizeLocale(ruTranslation, enTranslation, 'ru'),
  sw: sanitizeLocale(swTranslation, enTranslation, 'sw'),
  ta: sanitizeLocale(taTranslation, enTranslation, 'ta'),
  th: sanitizeLocale(thTranslation, enTranslation, 'th'),
  tl: sanitizeLocale(tlTranslation, enTranslation, 'tl'),
  tr: sanitizeLocale(trTranslation, enTranslation, 'tr'),
  uk: sanitizeLocale(ukTranslation, enTranslation, 'uk'),
  ur: sanitizeLocale(urTranslation, enTranslation, 'ur'),
  vi: sanitizeLocale(viTranslation, enTranslation, 'vi'),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh_CN: { translation: sanitizedResources.zh_CN },
      zh_TW: { translation: sanitizedResources.zh_TW },
      en: { translation: sanitizedResources.en },
      ar: { translation: sanitizedResources.ar },
      bn: { translation: sanitizedResources.bn },
      de: { translation: sanitizedResources.de },
      es: { translation: sanitizedResources.es },
      fa: { translation: sanitizedResources.fa },
      fr: { translation: sanitizedResources.fr },
      he: { translation: sanitizedResources.he },
      hi: { translation: sanitizedResources.hi },
      id: { translation: sanitizedResources.id },
      it: { translation: sanitizedResources.it },
      ja: { translation: sanitizedResources.ja },
      ko: { translation: sanitizedResources.ko },
      ms: { translation: sanitizedResources.ms },
      nl: { translation: sanitizedResources.nl },
      pl: { translation: sanitizedResources.pl },
      pt: { translation: sanitizedResources.pt },
      pt_BR: { translation: sanitizedResources.pt_BR },
      ru: { translation: sanitizedResources.ru },
      sw: { translation: sanitizedResources.sw },
      ta: { translation: sanitizedResources.ta },
      th: { translation: sanitizedResources.th },
      tl: { translation: sanitizedResources.tl },
      tr: { translation: sanitizedResources.tr },
      uk: { translation: sanitizedResources.uk },
      ur: { translation: sanitizedResources.ur },
      vi: { translation: sanitizedResources.vi },
    },
    fallbackLng: 'zh_CN',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
