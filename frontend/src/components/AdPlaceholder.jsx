import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PictureOutlined } from '@ant-design/icons';
import '../styles/AdPlaceholder.css';

const AdPlaceholder = ({
    ratio,
    label,
    className = '',
    width = '100%',
    height = 'auto',
    style: customStyle
}) => {
    const { t } = useTranslation();
    const [logoUrl, setLogoUrl] = useState('');
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const electron = window.require ? window.require('electron') : null;
                if (electron?.ipcRenderer) {
                    const url = await electron.ipcRenderer.invoke('get-resource-url', 'kq.png');
                    if (url) {
                        setLogoUrl(url);
                    }
                }
            } catch (e) {
                console.error('Failed to load placeholder logo', e);
            }
        };
        loadLogo();
    }, []);

    const containerStyle = {
        aspectRatio: ratio ? `${ratio}` : undefined,
        width,
        height,
        borderRadius: '8px',
        boxSizing: 'border-box',
        WebkitAppRegion: 'no-drag',
        cursor: 'default',
        padding: '12px',
        ...customStyle
    };

    const isLoading = label && (label.includes('加载中') || label.includes(t('ad.loading')));
    const isSmall = ratio && ratio > 3; // For 4:1 banner (small height)

    return (
        <div className={`ad-placeholder ${className} ${isLoading ? 'loading' : ''}`} style={containerStyle}>
            {isLoading ? (
                // Loading State
                <>
                    <div className="ad-placeholder-shimmer"></div>
                    <span className="ad-placeholder-text">{label}</span>
                </>
            ) : (
                // Branding State (Empty Ad)
                <div className={`ad-branding-container ${isSmall ? 'small' : ''}`}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="ad-branding-logo" />
                    ) : (
                        <PictureOutlined className="ad-branding-icon" />
                    )}
                    <div className="ad-branding-content">
                        <div className="ad-branding-title">{t('ad.brand')}</div>
                        <div className="ad-branding-slogan">{t('ad.slogan')}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdPlaceholder;
