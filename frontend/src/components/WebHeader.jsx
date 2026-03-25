import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useUserStore } from '../stores/useUserStore';
import { createSafeTranslator } from '../utils/safeTranslation';
import './WebShell.css';

const SITE_ORIGIN = 'https://www.kunqiongai.com';
const BRAND_TITLE = '鲲穹AI工具箱';

function WebHeader({ onMenuToggle }) {
  const { t: rawT, i18n } = useTranslation();
  const location = useLocation();
  const { isLoggedIn, userInfo, isPolling, showLoginModal, startLoginProcess, init } = useUserStore();
  const fallbackT = i18n.getFixedT('en');
  const t = createSafeTranslator(rawT, fallbackT, i18n.language);

  const navItems = [
    { key: 'home', href: `${SITE_ORIGIN}/` },
    { key: 'ai_tools', href: `${SITE_ORIGIN}/category/ai` },
    { key: 'office_tools', href: `${SITE_ORIGIN}/category/office` },
    { key: 'multimedia', href: `${SITE_ORIGIN}/category/multimedia` },
    { key: 'development_tools', href: `${SITE_ORIGIN}/category/development` },
    { key: 'text_processing', href: `${SITE_ORIGIN}/category/text` },
    { key: 'file_processing', href: `${SITE_ORIGIN}/category/file` },
    { key: 'system_tools', href: `${SITE_ORIGIN}/category/system` },
    { key: 'life_tools', href: `${SITE_ORIGIN}/category/life` },
    { key: 'industry_news', href: `${SITE_ORIGIN}/news` },
    { key: 'software_customization', href: `${SITE_ORIGIN}/custom` },
  ];

  const languages = [
    { value: 'zh_CN', label: t('header.languages.zh_CN') },
    { value: 'zh_TW', label: t('header.languages.zh_TW') },
    { value: 'en', label: t('header.languages.en') },
    { value: 'ar', label: t('header.languages.ar') },
    { value: 'bn', label: t('header.languages.bn') },
    { value: 'de', label: t('header.languages.de') },
    { value: 'es', label: t('header.languages.es') },
    { value: 'fa', label: t('header.languages.fa') },
    { value: 'fr', label: t('header.languages.fr') },
    { value: 'he', label: t('header.languages.he') },
    { value: 'hi', label: t('header.languages.hi') },
    { value: 'id', label: t('header.languages.id') },
    { value: 'it', label: t('header.languages.it') },
    { value: 'ja', label: t('header.languages.ja') },
    { value: 'ko', label: t('header.languages.ko') },
    { value: 'ms', label: t('header.languages.ms') },
    { value: 'nl', label: t('header.languages.nl') },
    { value: 'pl', label: t('header.languages.pl') },
    { value: 'pt', label: t('header.languages.pt') },
    { value: 'pt_BR', label: t('header.languages.pt_BR') },
    { value: 'ru', label: t('header.languages.ru') },
    { value: 'sw', label: t('header.languages.sw') },
    { value: 'ta', label: t('header.languages.ta') },
    { value: 'th', label: t('header.languages.th') },
    { value: 'tl', label: t('header.languages.tl') },
    { value: 'tr', label: t('header.languages.tr') },
    { value: 'uk', label: t('header.languages.uk') },
    { value: 'ur', label: t('header.languages.ur') },
    { value: 'vi', label: t('header.languages.vi') },
  ];

  const currentLanguage = languages.some((item) => item.value === i18n.language)
    ? i18n.language
    : 'zh_CN';

  const isNavActive = (item) => {
    if (item.to === '/') {
      return location.pathname === '/' && !location.pathname.includes('/tools/');
    }
    return item.to ? location.pathname === item.to : false;
  };

  useEffect(() => {
    init();
  }, [init]);

  const renderUserAction = () => {
    if (isLoggedIn && userInfo) {
      return (
        <button type="button" className="web-user-trigger" onClick={showLoginModal}>
          <span className="web-user-avatar">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt={userInfo.nickname || 'User'} />
            ) : (
              <span>{(userInfo.nickname || 'U').slice(0, 1)}</span>
            )}
          </span>
          <span className="web-user-name">{userInfo.nickname}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        className="web-login-btn"
        onClick={startLoginProcess}
        disabled={isPolling}
      >
        <span className="web-login-label web-login-label-desktop">
          {isPolling ? t('header.logging_in') : t('webHeader.login_register')}
        </span>
        <span className="web-login-label web-login-label-mobile">
          {isPolling ? t('header.logging_in') : t('webHeader.login')}
        </span>
      </button>
    );
  };

  return (
    <header className="web-header">
      <div className="web-header-container">
        <div className="web-header-left">
          <Link to="/" className="web-logo-link">
            <img src="/logo.ico" alt="鲲穹AI工具箱" className="web-logo-img" />
            <span className="web-brand-copy">
              <strong className="web-brand-title">鲲穹AI工具箱</strong>
              <span className="web-brand-subtitle">{t('webHeader.brand_subtitle')}</span>
            </span>
          </Link>
        </div>

        <nav className="web-nav">
          {navItems.map((item) => (
            item.to ? (
              <Link
                key={item.key}
                to={item.to}
                className={`web-nav-link ${isNavActive(item) ? 'active' : ''}`}
              >
                {t(`webHeader.nav.${item.key}`)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={item.href}
                className="web-nav-link"
              >
                {t(`webHeader.nav.${item.key}`)}
              </a>
            )
          ))}
        </nav>

        <div className="web-header-right">
          <form className="web-search-box" action={`${SITE_ORIGIN}/search`} method="get">
            <button type="submit" className="web-search-submit" aria-label={t('webHeader.search_aria')}>
              <SearchOutlined />
            </button>
            <input type="text" name="q" placeholder={t('webHeader.search_placeholder')} />
          </form>

          <div className="web-header-actions">
            <a href={`${SITE_ORIGIN}/search`} className="web-mobile-search-btn" aria-label={t('webHeader.search_aria')}>
              <SearchOutlined />
            </a>
            <button type="button" className="web-mobile-menu-btn" aria-label={t('webHeader.menu_aria')} onClick={onMenuToggle}>
              <MenuOutlined />
            </button>
            {renderUserAction()}
          </div>
        </div>
      </div>
      <LoginModal />
    </header>
  );
}

export default WebHeader;
