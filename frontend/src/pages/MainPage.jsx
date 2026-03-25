import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data';
import ToolHeader from '../components/ToolHeader';
import ToolSidebar from '../components/ToolSidebar';
import ToolDetailContent from '../components/ToolDetailContent';
import { getCategoryByExtension, findSectionByToolName } from '../utils/toolHelpers';
import '../App.css';

function MainPage() {
  const { t } = useTranslation();
  const { source, target } = useParams();
  const navigate = useNavigate();
  const categoryData = useMemo(() => categories.major_functions || [], []);

  const [activeSection, setActiveSection] = useState(
    categoryData.length > 0 ? categoryData[0] : null
  );
  const [isMaximized, setIsMaximized] = useState(false);

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
    navigate('/');
  }, [navigate]);

  const handleSectionClick = useCallback((section) => {
    setActiveSection(section || categoryData[0] || null);
    navigate('/');
  }, [categoryData, navigate]);

  const handleToolClick = useCallback((tool, section) => {
    const parts = tool.name.split(' To ');
    if (parts.length === 2) {
      navigate(`/tool/${parts[0].toLowerCase()}/${parts[1].toLowerCase()}`);
    } else {
      navigate('/');
    }

    if (section) {
      setActiveSection(section);
      return;
    }

    const foundSection = findSectionByToolName(tool.name);
    if (foundSection) {
      setActiveSection(foundSection);
    }
  }, [navigate]);

  const toolDetail = useMemo(() => {
    if (!selectedTool) return null;
    return <ToolDetailContent toolName={selectedTool} onBack={handleBackToGrid} />;
  }, [selectedTool, handleBackToGrid]);

  if (!effectiveSection) return null;

  return (
    <div className={`app-container ${isMaximized ? 'maximized' : ''}`}>
      <ToolHeader
        onHomeClick={() => handleSectionClick(categoryData[0])}
        activeSection={t(`categories.${effectiveSection.name}`)}
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
