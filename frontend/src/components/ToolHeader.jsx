import { useNavigate } from 'react-router-dom';
import '../App.css'; // Ensure CSS variables are available

function ToolHeader() {
  const navigate = useNavigate();

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <div className="nav-logo-placeholder">LOGO</div>
        <button className="nav-back-btn" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>返回首页</span>
        </button>
      </div>
      
      <div className="nav-right">
        <div className="ad-banner-top">
          AD (4:1)
        </div>
        <button className="login-btn">登录</button>
      </div>
    </nav>
  );
}

export default ToolHeader;
