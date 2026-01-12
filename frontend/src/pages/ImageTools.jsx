import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data';
import ToolHeader from '../components/ToolHeader';
import ToolSidebar from '../components/ToolSidebar';
import '../App.css';

function ImageTools() {
  const navigate = useNavigate();
  const categoryData = categories['图片类'];
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setActiveSection(categoryData[0]);
    } else {
        navigate('/');
    }
  }, [categoryData, navigate]);

  if (!activeSection) return null;

  return (
    <div className="app-container">
      <ToolHeader />
      <div className="main-layout">
        <ToolSidebar 
          sections={categoryData} 
          activeSection={activeSection} 
          onSectionClick={setActiveSection} 
        />
        <main className="content-area">
          <div className="content-wrapper">
            <div className="section-header">
              <div className="section-divider"></div>
              <h2 className="section-title">{activeSection.name}</h2>
            </div>
            
            <div className="card-grid">
              {activeSection.tools.map((tool) => (
                <div key={tool} className="tool-card">
                  <div className="card-icon-wrapper">
                    <div className="file-icon source">IMG</div>
                    <div className="arrow-icon">→</div>
                    <div className="file-icon target">JPG</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{tool}</h3>
                    <div className="card-tags">
                      <span className="tag">IMAGE TOOLS</span>
                    </div>
                    <p className="card-desc">
                      一款在线{tool}转换器，支持自定义参数，提供多种分辨率选项，助您轻松完成格式转换。
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ImageTools;
