import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data';
import ToolHeader from '../components/ToolHeader';
import ToolSidebar from '../components/ToolSidebar';
// 导入示例业务组件
import ToolDetailContent from '../components/ToolDetailContent';
import '../App.css';

function MainPage() {
  const { source, target } = useParams();
  // 默认使用第一个分类组，你可以根据需要修改这里
  const categoryData = categories['主要功能'] || categories['文档类'] || []; 
  
  const [activeSection, setActiveSection] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

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

  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setActiveSection(categoryData[0]);
    }
  }, []); // 仅挂载时执行一次

  // 处理 URL 参数，自动定位到工具页
  useEffect(() => {
    if (source && target && categoryData) {
      // 将 URL 参数转换为工具名称 (例如: pdf/word -> "PDF To Word")
      // 注意：这里的匹配逻辑需要根据 data.js 中的实际命名规范进行调整
      // 当前示例假设 URL 参数直接对应工具名称
      
      // 简单的大小写转换示例
      const toolName = `${source.toUpperCase()} To ${target.toUpperCase()}`;
      
      // 查找包含该工具的分类
      for (const section of categoryData) {
        const tool = section.tools.find(t => 
          t.name.toLowerCase() === toolName.toLowerCase()
        );
        if (tool) {
          setActiveSection(section);
          setSelectedTool(tool.name);
          break;
        }
      }
    }
  }, [source, target]);

  const handleBackToGrid = () => {
    setSelectedTool(null);
  };

  // 渲染具体业务组件的函数
  // 你应该在这里根据 selectedTool 渲染不同的组件
  const renderFeatureComponent = () => {
    if (!selectedTool) return null;

    return (
      <ToolDetailContent 
        toolName={selectedTool} 
        onBack={handleBackToGrid}
      />
    );
  };

  if (!activeSection) return null;

  return (
    <div className={`app-container ${isMaximized ? 'maximized' : ''}`}>
      <ToolHeader />
      <div className="main-layout">
        <ToolSidebar 
          sections={categoryData} 
          activeSection={activeSection} 
          onSectionClick={(section) => {
            setActiveSection(section);
            setSelectedTool(null);
          }} 
          onToolClick={(tool, section) => {
            setActiveSection(section);
            setSelectedTool(tool.name);
          }}
        />
        <main className="content-area">
          <div className="content-wrapper">
            {selectedTool ? (
              renderFeatureComponent()
            ) : (
              <>
                <div className="section-header">
                  <div className="section-divider"></div>
                  <h2 className="section-title">{activeSection.name}</h2>
                </div>
                
                {/* 网格视图 */}
                <div className="card-grid">
                  {activeSection.tools.map((tool) => {
                    const parts = tool.name.split(' To ');
                    const source = parts[0] || 'TOOL';
                    const target = parts[1] || 'BOX';
                    
                    return (
                      <div 
                        key={tool.name} 
                        className="tool-card"
                        onClick={() => setSelectedTool(tool.name)}
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
