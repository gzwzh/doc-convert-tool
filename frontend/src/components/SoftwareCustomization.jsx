import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth';

function SoftwareCustomization() {
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      const url = await AuthService.fetchCustomUrl();
      if (url) {
        setCustomUrl(url);
      }
    };

    getUrl();
  }, []);

  const handleClick = async () => {
    if (!customUrl) return;

    if (window.electronAPI?.openExternal) {
      await window.electronAPI.openExternal(customUrl);
      return;
    }

    window.open(customUrl, '_blank', 'noopener,noreferrer');
  };

  if (!customUrl) {
    return null;
  }

  return (
    <button
      type="button"
      className="sidebar-link-btn software-customization-btn"
      onClick={handleClick}
      title="点击咨询软件定制服务"
    >
      <span className="software-customization-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2" />
        </svg>
        <span>软件定制</span>
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="external-link-icon">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </button>
  );
}

export default SoftwareCustomization;
