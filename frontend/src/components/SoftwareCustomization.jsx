import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/auth';

const SoftwareCustomization = () => {
  const { t } = useTranslation();
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      try {
        const url = await AuthService.fetchCustomUrl();
        if (url) {
          setCustomUrl(url);
        }
      } catch (error) {
        console.error("Failed to fetch custom URL:", error);
      }
    };
    getUrl();
  }, []);

  const handleClick = () => {
    if (!customUrl) return;

    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(customUrl);
    } else {
      window.open(customUrl, '_blank');
    }
  };

  if (!customUrl) return null;

  return (
    <div
      className="sidebar-item software-customization-btn"
      onClick={handleClick}
      title={t('customization.tooltip')}
    >
      <span className="software-customization-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
        {t('customization.title')}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="external-link-icon">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </div>
  );
};

export default SoftwareCustomization;
