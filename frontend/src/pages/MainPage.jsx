import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data';
import Dashboard from '../components/Dashboard';
import ToolHeader from '../components/ToolHeader';
import ToolSidebar from '../components/ToolSidebar';
import ToolDetailContent from '../components/ToolDetailContent';
import { getCategoryByExtension, findSectionByToolName } from '../utils/toolHelpers';
import '../App.css';

const FAVORITES_STORAGE_KEY = 'desktop-favorite-tools';
const HISTORY_STORAGE_KEY = 'desktop-recent-tools';

const readStoredArray = (key) => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

function MainPage() {
  const { t } = useTranslation();
  const { source, target } = useParams();
  const navigate = useNavigate();
  const categoryData = useMemo(() => categories.major_functions || [], []);

  const [activeSection, setActiveSection] = useState(
    categoryData.length > 0 ? categoryData[0] : null
  );
  const [isMaximized, setIsMaximized] = useState(false);
  const [isHomeView, setIsHomeView] = useState(!source && !target);
  const [favorites, setFavorites] = useState(() => readStoredArray(FAVORITES_STORAGE_KEY));
  const [history, setHistory] = useState(() => readStoredArray(HISTORY_STORAGE_KEY));

  useEffect(() => {
    const electron = window.require ? window.require('electron') : null;
    if (!electron) return undefined;

    const handleMaximizedStateChange = (event, state) => {
      setIsMaximized(state);
    };

    electron.ipcRenderer.on('window-maximized-state-changed', handleMaximizedStateChange);
    return () => {
      electron.ipcRenderer.removeListener('window-maximized-state-changed', handleMaximizedStateChange);
    };
  }, []);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDrop = (event) => {
      if (event.defaultPrevented) return;

      event.preventDefault();
      event.stopPropagation();

      const files = event.dataTransfer.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const extension = file.name.split('.').pop();
      const categoryName = getCategoryByExtension(extension);
      if (!categoryName) return;

      const section = categoryData.find((item) => item.name === categoryName);
      if (section) {
        setIsHomeView(false);
        setActiveSection(section);
        navigate('/');
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [categoryData, navigate]);

  useEffect(() => {
    setIsHomeView(!source && !target);
  }, [source, target]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  const selectedTool = useMemo(() => {
    if (!source || !target || categoryData.length === 0) return null;

    const toolName = `${source.toUpperCase()} To ${target.toUpperCase()}`;
    for (const section of categoryData) {
      const tool = section.tools.find((item) => item.name.toLowerCase() === toolName.toLowerCase());
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
    setIsHomeView(false);
    navigate('/');
  }, [navigate]);

  const handleSectionClick = useCallback((section) => {
    setIsHomeView(false);
    setActiveSection(section || categoryData[0] || null);
    navigate('/');
  }, [categoryData, navigate]);

  const handleHomeClick = useCallback(() => {
    setIsHomeView(true);
    navigate('/');
  }, [navigate]);

  const handleToolClick = useCallback((tool, section) => {
    setIsHomeView(false);

    const parts = tool.name.split(' To ');
    if (parts.length === 2) {
      navigate(`/tool/${parts[0].toLowerCase()}/${parts[1].toLowerCase()}`);
    } else {
      navigate('/');
    }

    if (section) {
      setActiveSection(section);
    } else {
      const foundSection = findSectionByToolName(tool.name);
      if (foundSection) {
        setActiveSection(foundSection);
      }
    }

    setHistory((prevHistory) => {
      const nextHistory = [tool.name, ...prevHistory.filter((item) => item !== tool.name)];
      return nextHistory.slice(0, 12);
    });
  }, [navigate]);

  const handleFavoriteToggle = useCallback((toolName) => {
    setFavorites((prevFavorites) => (
      prevFavorites.includes(toolName)
        ? prevFavorites.filter((item) => item !== toolName)
        : [toolName, ...prevFavorites].slice(0, 20)
    ));
  }, []);

  const toolDetail = useMemo(() => {
    if (!selectedTool) return null;
    return <ToolDetailContent toolName={selectedTool} onBack={handleBackToGrid} />;
  }, [selectedTool, handleBackToGrid]);

  if (!effectiveSection) return null;

  return (
    <div className={`app-container ${isMaximized ? 'maximized' : ''}`}>
      <ToolHeader
        onHomeClick={handleHomeClick}
        activeSection={isHomeView ? t('header.home') : t(`categories.${effectiveSection.name}`)}
      />
      <div className="main-layout desktop-main-layout">
        <ToolSidebar
          sections={categoryData}
          activeSection={effectiveSection}
          onSectionClick={handleSectionClick}
          onToolClick={handleToolClick}
        />

        <main className="content-area">
          <div className="content-wrapper desktop-content-wrapper">
            {selectedTool ? (
              toolDetail
            ) : isHomeView ? (
              <>
                <div className="category-home-section">
                  <div className="section-header">
                    <div className="section-divider"></div>
                    <h2 className="section-title">{t('header.home')}</h2>
                  </div>

                  <div className="category-home-grid">
                    {categoryData.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.name}
                          type="button"
                          className="category-home-card"
                          onClick={() => handleSectionClick(section)}
                        >
                          <span className="category-home-card-icon">
                            {IconComponent ? <IconComponent /> : null}
                          </span>
                          <span className="category-home-card-copy">
                            <h3>{t(`categories.${section.name}`)}</h3>
                            <p>{t(`categories.${section.description}`)}</p>
                          </span>
                          <span className="category-home-card-arrow">+</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Dashboard
                  history={history}
                  favorites={favorites}
                  onToolClick={handleToolClick}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </>
            ) : (
              <>
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">{t(`categories.${effectiveSection.name}`)}</h2>
                </div>

                <div className="card-grid desktop-card-grid">
                  {effectiveSection.tools.map((tool) => {
                    const [sourceName = 'TOOL', targetName = 'BOX'] = tool.name.split(' To ');
                    return (
                      <div
                        key={tool.name}
                        className="tool-card desktop-tool-card"
                        onClick={() => handleToolClick(tool, effectiveSection)}
                      >
                        <div className="tool-card-icon desktop-tool-card-icon">
                          <span className="format-text source">{sourceName}</span>
                          <div className="format-divider"></div>
                          <span className="format-text target">{targetName}</span>
                        </div>

                        <div className="card-content">
                          <div className="card-header-row">
                            <h3 className="card-title">{tool.name}</h3>
                            <div className="card-tags">
                              <span className="tag">{sourceName} TOOLS</span>
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
