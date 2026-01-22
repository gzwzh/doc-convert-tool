import React, { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Avatar } from 'antd';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import AdBanner from './AdBanner';
import { useUserStore } from '../stores/useUserStore';
import LoginModal from './LoginModal';
import '../styles/LoginModal.css';
import '../App.css';

function ToolHeader() {
  const { isLoggedIn, userInfo, isPolling, showLoginModal, init } = useUserStore();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    init();
  }, [init]);

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
          <span>登录中...</span>
        </button>
      );
    }

    return (
      <button className="user-btn" onClick={showLoginModal}>
        登录
      </button>
    );
  };

  // 窗口控制逻辑
  // eslint-disable-next-line no-undef
  const electron = window.require ? window.require('electron') : null;
  const handleMin = () => electron?.ipcRenderer.send('window-min');
  const handleMax = () => electron?.ipcRenderer.send('window-max');
  const handleClose = () => electron?.ipcRenderer.send('window-close');

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <div className="nav-logo-wrapper">
          <img src="/icon.ico" alt="Logo" className="nav-app-icon" />
          <div className="nav-app-info">
            <div className="nav-app-title">全能图转</div>
            <div className="nav-app-subtitle">鲲穹AI旗下产品</div>
          </div>
        </div>
      </div>

      <div className="nav-right">
        <AdBanner
          positions={['adv_position_01']}
          ratio={4}
          placeholderLabel="AD (4:1)"
          width={160}
        />
        <div className="user-btn-container">
          {renderUserArea()}
        </div>

        {/* Theme Toggle */}
        <button
          className="window-control-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? '切换深色模式' : '切换浅色模式'}
        >
          {theme === 'light' ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>

        {/* 窗口控制器 - 方案 C */}
        <div className="window-controls">
          <button className="window-control-btn" onClick={handleMin} title="最小化">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button className="window-control-btn" onClick={handleMax} title="最大化/还原">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
            </svg>
          </button>
          <button className="window-control-btn close-btn" onClick={handleClose} title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <LoginModal />
    </nav>
  );
}

export default ToolHeader;
