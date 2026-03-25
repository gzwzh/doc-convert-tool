import { useTranslation } from 'react-i18next';
import { createSafeTranslator } from '../utils/safeTranslation';
import './WebShell.css';

const SITE_ORIGIN = 'https://www.kunqiongai.com';

function WebFooter() {
  const { t: rawT, i18n } = useTranslation();
  const fallbackT = i18n.getFixedT('en');
  const t = createSafeTranslator(rawT, fallbackT, i18n.language);
  const brandTitle = t('webFooter.brand_title');
  const icpNumber = t('webFooter.icp_number');

  const quickLinks = [
    { key: 'home', href: `${SITE_ORIGIN}/` },
    { key: 'ai_tools', href: `${SITE_ORIGIN}/category/ai` },
    { key: 'custom_service', href: `${SITE_ORIGIN}/custom` },
    { key: 'industry_news', href: `${SITE_ORIGIN}/news` },
    { key: 'feedback', href: `${SITE_ORIGIN}/feedback` },
  ];

  const toolLinks = [
    { key: 'text_processing', href: `${SITE_ORIGIN}/category/text` },
    { key: 'image_generation', href: `${SITE_ORIGIN}/category/multimedia` },
    { key: 'office_tools', href: `${SITE_ORIGIN}/category/office` },
    { key: 'file_processing', href: `${SITE_ORIGIN}/category/file` },
    { key: 'code_development', href: `${SITE_ORIGIN}/category/development` },
  ];

  return (
    <footer className="web-footer">
      <div className="web-footer-container">
        <div className="web-footer-content">
          <div className="web-footer-section web-footer-brand">
            <div className="web-footer-brand-head">
              <img src="/logo.ico" alt={brandTitle} className="web-footer-logo" />
              <div className="web-footer-brand-copy">
                <strong className="web-footer-title">{brandTitle}</strong>
                <span className="web-footer-subtitle">{t('webFooter.brand_subtitle')}</span>
              </div>
            </div>
            <p className="web-footer-desc">{t('webFooter.description')}</p>
            <div className="web-footer-social">
              <a href={`${SITE_ORIGIN}/`} className="web-social-icon" aria-label={t('webFooter.social.douyin')}>
                {t('webFooter.social.douyin')}
              </a>
              <a href={`${SITE_ORIGIN}/`} className="web-social-icon" aria-label={t('webFooter.social.wechat')}>
                {t('webFooter.social.wechat')}
              </a>
              <a href={`${SITE_ORIGIN}/`} className="web-social-icon" aria-label={t('webFooter.social.weibo')}>
                {t('webFooter.social.weibo')}
              </a>
            </div>
          </div>

          <div className="web-footer-section">
            <h4>{t('webFooter.sections.quick_links')}</h4>
            <ul>
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <a href={item.href}>{t(`webFooter.quick_links.${item.key}`)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="web-footer-section">
            <h4>{t('webFooter.sections.tool_categories')}</h4>
            <ul>
              {toolLinks.map((item) => (
                <li key={item.key}>
                  <a href={item.href}>{t(`webFooter.tool_links.${item.key}`)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="web-footer-section">
            <h4>{t('webFooter.sections.contact_us')}</h4>
            <ul className="web-contact-list">
              <li>{t('webFooter.contact.company')}: {t('webFooter.contact.company_name')}</li>
              <li>{t('webFooter.contact.phone')}: {t('webFooter.contact.phone_number')}</li>
              <li>{t('webFooter.contact.address')}: {t('webFooter.contact.address_detail')}</li>
              <li>{t('webFooter.contact.email')}: {t('webFooter.contact.email_address')}</li>
            </ul>
          </div>
        </div>

        <div className="web-footer-bottom">
          <p className="web-copyright-links">
            <span>{t('webFooter.copyright', { year: 2026, brand: brandTitle })}</span>
            <span className="separator">|</span>
            <a href={`${SITE_ORIGIN}/agreement`}>{t('webFooter.user_agreement')}</a>
            <span className="separator">|</span>
            <a href={`${SITE_ORIGIN}/privacy`}>{t('webFooter.privacy_policy')}</a>
            <span className="separator">|</span>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
              {t('webFooter.icp_label')}: {icpNumber}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default WebFooter;
