import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/auth';

const QuestionFeedback = () => {
  const { t } = useTranslation();
  const [feedbackUrl, setFeedbackUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      try {
        const url = await AuthService.fetchFeedbackUrl();
        if (url) {
          setFeedbackUrl(url);
        }
      } catch (error) {
        console.error("Failed to fetch feedback URL:", error);
      }
    };
    getUrl();
  }, []);

  const handleClick = () => {
    if (!feedbackUrl) return;

    if (window.electronAPI && window.electronAPI.openExternal) {
      window.electronAPI.openExternal(feedbackUrl);
    } else {
      window.open(feedbackUrl, '_blank');
    }
  };

  if (!feedbackUrl) return null;

  return (
    <div
      className="sidebar-item software-customization-btn"
      onClick={handleClick}
      title={t('feedback.tooltip')}
    >
      <span className="software-customization-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 5.3 1.9L21 4.5V11.5z"></path>
          <path d="M12 11h.01"></path>
          <path d="M12 16h.01"></path>
          <path d="M12 7h.01"></path>
        </svg>
        {t('feedback.title')}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="external-link-icon">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </div>
  );
};

export default QuestionFeedback;
