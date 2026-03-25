const MOJIBAKE_PATTERN = /\?{2,}|�|锟|漏|[銈鏂袦丕]/;

export function isSuspiciousTranslation(value, locale) {
  if (typeof value !== 'string') {
    return false;
  }

  if (locale === 'zh_CN' || locale === 'zh_TW') {
    return false;
  }

  return MOJIBAKE_PATTERN.test(value);
}

export function createSafeTranslator(rawT, fallbackT, locale) {
  return function safeT(key, options) {
    const result = rawT(key, options);

    if (result === key || isSuspiciousTranslation(result, locale)) {
      return fallbackT(key, options);
    }

    return result;
  };
}
