import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data';
import ToolHeader from '../components/ToolHeader';
import ToolSidebar from '../components/ToolSidebar';
// 导入示例业务组件
import ToolDetailContent from '../components/ToolDetailContent';
import Dashboard from '../components/Dashboard';
import { getCategoryByExtension, findSectionByToolName } from '../utils/toolHelpers';
import '../App.css';

function MainPage() {
  const { t } = useTranslation();
  const { source, target } = useParams();
  const navigate = useNavigate();
  // 默认使用第一个分类组，你可以根据需要修改这里
  const categoryData = useMemo(() => 
    categories['major_functions'] || categories['major_functions'] || [], 
    []
  ); 
  
  const [activeSection, setActiveSection] = useState(
    categoryData && categoryData.length > 0 ? categoryData[0] : null
  );
  const [isMaximized, setIsMaximized] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('toolHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('toolFavorites');
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  // Save history and favorites
  useEffect(() => {
    localStorage.setItem('toolHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('toolFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToHistory = useCallback((toolName) => {
    setHistory(prev => {
      const newHistory = [toolName, ...prev.filter(t => t !== toolName)];
      return newHistory.slice(0, 10); // Limit to 10
    });
  }, []);

  const toggleFavorite = useCallback((toolName) => {
    setFavorites(prev => {
      if (prev.includes(toolName)) {
        return prev.filter(t => t !== toolName);
      } else {
        return [...prev, toolName];
      }
    });
  }, []);

  useEffect(() => {
    // 监听窗口最大化状态 (Electron 环境适配)
    const electron = window.require ? window.require('electron') : null;
    if (electron) {
      const handleMaximizedStateChange = (event, state) => {
        setIsMaximized(state);
      };
      electron.ipcRenderer.on('window-maximized-state-changed', handleMaximizedStateChange);
      return () => {
        electron.ipcRenderer.removeListener('window-maximized-state-changed', handleMaximizedStateChange);
      };
    }
  }, []);

  // Drag & Drop
  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        const ext = file.name.split('.').pop();
        const categoryName = getCategoryByExtension(ext);
        
        if (categoryName) {
          const section = categoryData.find(s => s.name === categoryName);
          if (section) {
            setActiveSection(section);
            navigate('/');
          }
        }
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [categoryData, navigate]);

  const selectedTool = useMemo(() => {
    if (!source || !target || !categoryData) return null;
    const toolName = `${source.toUpperCase()} To ${target.toUpperCase()}`;
    for (const section of categoryData) {
      const tool = section.tools.find(t => 
        t.name.toLowerCase() === toolName.toLowerCase()
      );
      if (tool) {
        return tool.name;
      }
    }
    return null;
  }, [source, target, categoryData]);

  const derivedSection = useMemo(() => {
    if (!selectedTool) return null;
    return findSectionByToolName(selectedTool);
  }, [selectedTool]);

  const effectiveSection = derivedSection || activeSection;

  const handleBackToGrid = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleSectionClick = useCallback((section) => {
    setActiveSection(section);
    navigate('/');
  }, [navigate]);

  const handleToolClick = useCallback((tool, section) => {
    addToHistory(tool.name);
    const parts = tool.name.split(' To ');
    if (parts.length === 2) {
      navigate(`/tool/${parts[0].toLowerCase()}/${parts[1].toLowerCase()}`);
    } else {
      navigate('/');
    }
    if (!section) {
      const foundSection = findSectionByToolName(tool.name);
      if (foundSection) {
        setActiveSection(foundSection);
      }
    } else {
      setActiveSection(section);
    }
  }, [addToHistory, navigate]);

  // 渲染具体业务组件的函数
  const renderFeatureComponent = useMemo(() => {
    if (!selectedTool) return null;

    return (
      <ToolDetailContent 
        toolName={selectedTool} 
        onBack={handleBackToGrid}
      />
    );
  }, [selectedTool, handleBackToGrid]);

  // 优化工具卡片渲染
  const toolCards = useMemo(() => {
    if (!effectiveSection || effectiveSection.name === '我的主页') return null;
    
    return effectiveSection.tools.map((tool) => {
      const parts = tool.name.split(' To ');
      const source = parts[0] || 'TOOL';
      const target = parts[1] || 'BOX';
      
      return (
        <div 
          key={tool.name} 
          className="tool-card"
          onClick={() => handleToolClick(tool, effectiveSection)}
        >
          <div className="tool-card-icon">
            <span className="format-text source">{source}</span>
            <div className="format-divider"></div>
            <span className="format-text target">{target}</span>
          </div>
          <div className="card-content">
            <div className="card-header-row">
              <h3 className="card-title">{tool.name}</h3>
              <div className="card-tags">
                <span className="tag">{source} TOOLS</span>
              </div>
            </div>
            <p className="card-desc">{tool.description}</p>
          </div>
        </div>
      );
    });
  }, [effectiveSection, handleToolClick]);

  if (!effectiveSection) return null;

  return (
    <div className={`app-container ${isMaximized ? 'maximized' : ''}`}>
      <ToolHeader 
        onHomeClick={() => handleSectionClick({ name: t('header.home') })}
        activeSection={effectiveSection?.name === t('header.home') ? t('header.home') : t(`categories.${effectiveSection?.name}`)}
      />
      <div className="main-layout">
        <ToolSidebar 
          sections={categoryData} 
          activeSection={effectiveSection} 
          onSectionClick={handleSectionClick} 
          onToolClick={handleToolClick}
        />
        <main className="content-area">
          <div className="content-wrapper">
            {selectedTool ? (
              renderFeatureComponent
            ) : (effectiveSection.name === '我的主页' || effectiveSection.name === t('header.home')) ? (
              <Dashboard 
                history={history}
                favorites={favorites}
                onToolClick={handleToolClick}
                onFavoriteToggle={toggleFavorite}
              />
            ) : (
              <>
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">{t(`categories.${effectiveSection.name}`)}</h2>
                </div>
                
                {/* 网格视图 */}
                <div className="card-grid">
                  {categoryData.find(s => s.name === effectiveSection.name)?.tools.map(tool => {
                    const parts = tool.name.split(' To ');
                    const source = parts[0] || 'TOOL';
                    return (
                      <div 
                        key={tool.name} 
                        className="tool-card"
                        onClick={() => handleToolClick(tool)}
                      >
                        <div className="tool-card-icon">
                          <span className="format-text source">{source}</span>
                          <div className="format-divider"></div>
                          <span className="format-text target">{parts[1] || 'BOX'}</span>
                        </div>
                        <div className="card-content">
                          <div className="card-header-row">
                            <h3 className="card-title">{tool.name}</h3>
                            <div className="card-tags">
                              <span className="tag">{source} TOOLS</span>
                            </div>
                          </div>
                          <p className="card-desc">{tool.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
