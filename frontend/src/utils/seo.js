import { categories } from '../data.js';
import { getCategorySlugBySectionName } from './toolHelpers.js';

export const SITE_URL = import.meta?.env?.VITE_SITE_URL || 'https://www.kunqiongai.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.ico`;

const normalizeSiteUrl = (url) => url.replace(/\/+$/, '');

export function getCanonicalUrl(pathname = '/') {
  const base = normalizeSiteUrl(SITE_URL);
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path === '/' ? '' : path}`;
}

export function getSeoData({ pathname = '/', selectedTool, effectiveSection, t }) {
  if (selectedTool) {
    const [source = 'Document', target = 'File'] = selectedTool.split(' To ');
    return {
      title: `${source} to ${target} Converter Online | ${t('header.app_title')}`,
      description: `Convert ${source} to ${target} online with ${t('header.app_title')}. Fast, secure, and easy file conversion for web users.`,
      canonicalUrl: getCanonicalUrl(pathname),
    };
  }

  if (effectiveSection?.name) {
    const sectionTitle = t(`categories.${effectiveSection.name}`);
    return {
      title: `${sectionTitle} | ${t('header.app_title')}`,
      description: `Explore ${sectionTitle.toLowerCase()} in ${t('header.app_title')}. Batch-friendly online conversion tools for documents, images, and office files.`,
      canonicalUrl: getCanonicalUrl(pathname),
    };
  }

  return {
    title: `${t('header.app_title')} | Online Document Conversion Tools`,
    description: 'Convert DOCX, PDF, HTML, JSON, XML, TXT, PPT and Excel files online. Fast, secure, multilingual document conversion toolbox.',
    canonicalUrl: getCanonicalUrl(pathname),
  };
}

export function getSitemapEntries() {
  const entries = [{ path: '/' }];

  (categories.major_functions || []).forEach((section) => {
    const sectionSlug = getCategorySlugBySectionName(section.name);
    if (sectionSlug) {
      entries.push({ path: `/tools/${sectionSlug}` });
    }

    (section.tools || []).forEach((tool) => {
      const [source, target] = tool.name.split(' To ');
      if (source && target) {
        entries.push({ path: `/tool/${source.toLowerCase()}/${target.toLowerCase()}` });
      }
    });
  });

  return entries;
}
