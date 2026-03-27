import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Select } from 'antd';
import { UserOutlined, LoadingOutlined, GlobalOutlined } from '@ant-design/icons';
import LoginModal from './LoginModal';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../stores/useUserStore';
import '../styles/LoginModal.css';
import '../App.css';

function ToolHeader({ onHomeClick, activeSection }) {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, userInfo, isPolling, showLoginModal, init } = useUserStore();
  const { theme, toggleTheme } = useTheme();
  const [appVersion, setAppVersion] = useState('v1.0.0');
  const isHomeActive = activeSection === t('header.home');

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
    { value: 'vi', label: t('header.languages.vi') }
  ];

  useEffect(() => {
    init();

    const fetchVersion = async () => {
      if (!window.electronAPI?.getVersion) {
        return;
      }

      try {
        const version = await window.electronAPI.getVersion();
        if (version) {
          setAppVersion(`v${version}`);
        }
      } catch (error) {
        console.error('Failed to get version:', error);
      }
    };

    fetchVersion();
  }, [init]);

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  const renderUserArea = () => {
    if (isLoggedIn && userInfo) {
      return (
        <div className="user-profile-trigger" onClick={showLoginModal}>
          <Avatar size={24} src={userInfo.avatar} icon={<UserOutlined />} />
          <span className="user-nickname">{userInfo.nickname}</span>
        </div>
      );
    }

    if (isPolling) {
      return (
        <button className="user-btn user-btn-polling" onClick={showLoginModal}>
          <LoadingOutlined spin />
          <span>{t('header.logging_in')}</span>
        </button>
      );
    }

    return (
      <button className="user-btn" onClick={showLoginModal}>
        {t('header.login')}
      </button>
    );
  };

  const handleMin = () => {
    window.electronAPI?.windowMinimize?.();
  };

  const handleMax = () => {
    window.electronAPI?.windowMaximize?.();
  };

  const handleClose = () => {
    window.electronAPI?.windowClose?.();
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <div className="nav-logo-wrapper">
          <img src="app.ico" alt="Logo" className="nav-app-icon" />
          <div className="nav-app-info">
            <div className="nav-app-title-wrapper">
              <div className="nav-app-title">{t('header.app_title')}</div>
              <span className="nav-app-version">{appVersion}</span>
            </div>
            <div className="nav-app-subtitle">{t('header.app_subtitle')}</div>
          </div>
        </div>

        <button
          type="button"
          className={`nav-home-btn ${isHomeActive ? 'active' : ''}`}
          onClick={onHomeClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t('header.home')}
        </button>
      </div>

      <div className="nav-right">
        <div className="user-btn-container">
          {renderUserArea()}
        </div>

        <div className="language-selector" style={{ display: 'flex', alignItems: 'center', margin: '0 8px' }}>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            options={languages}
            variant="borderless"
            popupMatchSelectWidth={false}
            suffixIcon={<GlobalOutlined style={{ fontSize: '16px', color: 'var(--text-secondary)' }} />}
            style={{
              width: 'auto',
              minWidth: '80px',
              fontSize: '13px'
            }}
            styles={{
              popup: {
                root: {
                  borderRadius: '12px',
                  padding: '4px',
                  boxShadow: 'var(--shadow-lg)'
                }
              }
            }}
          />
        </div>

        <button
          className="window-control-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? t('header.theme_to_dark') : t('header.theme_to_light')}
        >
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        <div className="window-controls">
          <button className="window-control-btn" onClick={handleMin} title="最小化">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button className="window-control-btn" onClick={handleMax} title="最大化/还原">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
            </svg>
          </button>
          <button className="window-control-btn close-btn" onClick={handleClose} title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <LoginModal />
    </nav>
  );
}

export default ToolHeader;
