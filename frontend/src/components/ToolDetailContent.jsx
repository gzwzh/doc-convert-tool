import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ToolDetailContent({ toolName, onBack }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWatermarkExpanded, setIsWatermarkExpanded] = useState(true);
  const [isPdfPagesExpanded, setIsPdfPagesExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    preview: true,
    css: true,
    cleanup: true
  });
  const [watermarkOptions, setWatermarkOptions] = useState({
    text: '',
    font: 'Arial Bold',
    color: '#cccccc',
    size: 40,
    opacity: 30,
    angle: 45,
    position: 'center'
  });
  const [convertOptions, setConvertOptions] = useState({
    quality: 85,
    backgroundColor: '#ffffff',
    csvDelimiter: 'Comma (,)',
    yamlIndent: 2,
    orientation: 'Landscape',
    pdfPageSelection: 'All Pages',
    animationDelay: 100,
    loopAnimation: true,
    speechSpeed: 1.0,
    speechPitch: 1.0,
    speechLanguage: 'English',
    pageSize: 'A4'
  });
  const [htmlOptions, setHtmlOptions] = useState({
    enablePreview: false,
    cssHandling: 'Preserve All CSS',
    compressCss: false,
    customCss: '',
    removeScripts: true,
    removeComments: false,
    compressHtml: false,
    removeEmptyTags: false,
    pageSize: 'A4',
    orientation: 'Portrait'
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const parseToolName = (name) => {
    const parts = name.split(' To ');
    if (parts.length === 2) {
      return { source: parts[0], target: parts[1] };
    }
    return { source: 'FILE', target: 'FILE' };
  };

  const { source, target } = parseToolName(toolName);

  // Determine if the right sidebar should be shown
  const showSidebar = source === 'JSON' 
    ? ['CSV', 'JPG', 'YAML'].includes(target)
    : source === 'TXT'
    ? ['SPEECH', 'PDF', 'JPG', 'PNG'].includes(target)
    : source === 'XML'
    ? ['PDF', 'JPG', 'CSV', 'YAML'].includes(target)
    : true;

  const handleHomeClick = () => {
    console.log('Navigating to home page');
    // Use setTimeout to ensure the click event is properly handled
    setTimeout(() => {
      navigate('/');
    }, 0);
  };

  const handleConverterClick = () => {
    // Map source format to appropriate route (document types only)
    const formatRoutes = {
      'DOCX': '/tools/docx',
      'HTML': '/tools/html',
      'JSON': '/tools/json',
      'PDF': '/tools/pdf',
      'TXT': '/tools/txt',
      'XML': '/tools/xml'
    };
    
    const route = formatRoutes[source];
    if (route) {
      console.log(`Navigating to ${route} for source ${source}`);
      // Use setTimeout to ensure the click event is properly handled
      setTimeout(() => {
        navigate(route);
      }, 0);
    } else {
      console.warn(`No route found for source format: ${source}, falling back to main doc page`);
      // Fallback to main document page if format not found
      setTimeout(() => {
        navigate('/tools/doc');
      }, 0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleConvert = () => {
    if (selectedFile) {
      alert(`开始转换: ${selectedFile.name} 从 ${source} 到 ${target}`);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="content-wrapper">
      <div className="detail-header">
        <div className="header-left">
          <div className="breadcrumbs">
            <span className="breadcrumb-item" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleHomeClick(); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              首页
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleConverterClick(); }}>{source} 工具</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{source}转为{target}</span>
          </div>
          
          <div className="detail-title-section">
            <h1 className="detail-title">{source}转{target}转换器</h1>
            <p className="detail-desc">
              在线将{source} Word文档转换为{target}格式。免费工具维护文本格式。转换后，您可以下载并共享文档。
            </p>
          </div>
        </div>
      </div>

      <div className={`main-content ${!showSidebar ? 'no-sidebar' : ''}`}>
        <div className="upload-section">
          <div 
            className={`upload-area ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="upload-content">
                <div className="upload-icon-wrapper">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00a3ff" strokeWidth="1.5">
                    <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.1-3.9-4.5-.5-3.1-3.1-5.5-6.1-5.5-2.5 0-4.6 1.6-5.4 3.9C4.3 8.1 2 9.8 2 12.5 2 15 4 17 6.5 17h1" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="12 12 12 16" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="9 13 12 10 15 13" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="upload-text-row">
                  <span className="upload-main-text">在这里拖放你的{source}文件</span>
                </div>
                <p className="upload-sub-text">或点击浏览文件</p>
                <button className="select-file-btn">
                  + 选择文件
                </button>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-info">
                  <div className="file-icon-large">{source}</div>
                  <div className="file-details">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
                <button className="remove-file-btn" onClick={handleRemoveFile}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {showSidebar && (
          <div className="convert-options">
            <div className="options-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00a3ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="18" cy="18" r="1" />
                <line x1="3" y1="6" x2="21" y2="6" opacity="0.2" />
                <line x1="3" y1="12" x2="21" y2="12" opacity="0.2" />
                <line x1="3" y1="18" x2="21" y2="18" opacity="0.2" />
                <circle cx="8" cy="6" r="2.5" fill="#00a3ff" stroke="none" />
                <circle cx="16" cy="12" r="2.5" fill="#00a3ff" stroke="none" />
                <circle cx="10" cy="18" r="2.5" fill="#00a3ff" stroke="none" />
              </svg>
              <h3 className="options-title">Conversion Options</h3>
            </div>
          <div className="options-list">
            {source === 'HTML' ? (
              <div className="html-specific-options">
                {/* Preview Options */}
                <div className={`option-group ${expandedSections.preview ? 'expanded' : ''}`}>
                  <div className="option-group-header" onClick={() => toggleSection('preview')}>
                    <span>Preview Options</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedSections.preview ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {expandedSections.preview && (
                    <div className="option-group-content">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={htmlOptions.enablePreview}
                          onChange={(e) => setHtmlOptions({...htmlOptions, enablePreview: e.target.checked})}
                        />
                        <span>Enable Preview</span>
                      </label>
                      <button className="preview-html-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview HTML
                      </button>
                    </div>
                  )}
                </div>

                {/* CSS Options */}
                <div className={`option-group ${expandedSections.css ? 'expanded' : ''}`}>
                  <div className="option-group-header" onClick={() => toggleSection('css')}>
                    <span>CSS Options</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedSections.css ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {expandedSections.css && (
                    <div className="option-group-content">
                      <div className="sub-option">
                        <label>CSS Handling</label>
                        <select 
                          value={htmlOptions.cssHandling}
                          onChange={(e) => setHtmlOptions({...htmlOptions, cssHandling: e.target.value})}
                        >
                          <option>Preserve All CSS</option>
                          <option>Inline CSS</option>
                          <option>Remove CSS</option>
                        </select>
                      </div>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={htmlOptions.compressCss}
                          onChange={(e) => setHtmlOptions({...htmlOptions, compressCss: e.target.checked})}
                        />
                        <span>Compress CSS</span>
                      </label>
                      <div className="sub-option">
                        <label>Custom CSS</label>
                        <textarea 
                          placeholder="Enter your custom CSS here..."
                          value={htmlOptions.customCss}
                          onChange={(e) => setHtmlOptions({...htmlOptions, customCss: e.target.value})}
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cleanup Options */}
                <div className={`option-group ${expandedSections.cleanup ? 'expanded' : ''}`}>
                  <div className="option-group-header" onClick={() => toggleSection('cleanup')}>
                    <span>Cleanup Options</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedSections.cleanup ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {expandedSections.cleanup && (
                    <div className="option-group-content">
                      <div className="cleanup-checkboxes">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={htmlOptions.removeScripts}
                            onChange={(e) => setHtmlOptions({...htmlOptions, removeScripts: e.target.checked})}
                          />
                          <span>Remove Scripts</span>
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={htmlOptions.removeComments}
                            onChange={(e) => setHtmlOptions({...htmlOptions, removeComments: e.target.checked})}
                          />
                          <span>Remove HTML Comments</span>
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={htmlOptions.compressHtml}
                            onChange={(e) => setHtmlOptions({...htmlOptions, compressHtml: e.target.checked})}
                          />
                          <span>Compress HTML</span>
                        </label>
                        <label className="checkbox-label">
                          <input 
                            type="checkbox" 
                            checked={htmlOptions.removeEmptyTags}
                            onChange={(e) => setHtmlOptions({...htmlOptions, removeEmptyTags: e.target.checked})}
                          />
                          <span>Remove Empty Tags</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF Specific Options */}
                {target === 'PDF' && (
                  <div className="option-group expanded">
                    <div className="option-group-header">
                      <span>Page Settings</span>
                    </div>
                    <div className="option-group-content">
                      <div className="sub-option">
                        <label>Page Size</label>
                        <select 
                          value={htmlOptions.pageSize}
                          onChange={(e) => setHtmlOptions({...htmlOptions, pageSize: e.target.value})}
                        >
                          <option>A4</option>
                          <option>Letter</option>
                          <option>A3</option>
                        </select>
                      </div>
                      <div className="sub-option">
                        <label>Orientation</label>
                        <select 
                          value={htmlOptions.orientation}
                          onChange={(e) => setHtmlOptions({...htmlOptions, orientation: e.target.value})}
                        >
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Specific Options */}
                {['GIF', 'JPG', 'PNG', 'WEBP'].includes(target) && (
                  <div className="option-group expanded">
                    <div className="option-group-header">
                      <span>Image Options</span>
                    </div>
                    <div className="option-group-content">
                      <div className="sub-option">
                        <label>Quality (1-100)</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="100" 
                          value={convertOptions.quality}
                          onChange={(e) => setConvertOptions({...convertOptions, quality: parseInt(e.target.value)})}
                        />
                        <span className="value-label-center">{convertOptions.quality}%</span>
                      </div>
                      
                      <div className="sub-option">
                        <label>Background Color</label>
                        <div className="color-picker-wrapper">
                          <input 
                            type="color" 
                            value={convertOptions.backgroundColor}
                            onChange={(e) => setConvertOptions({...convertOptions, backgroundColor: e.target.value})}
                            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                          />
                          <div 
                            className="color-preview" 
                            style={{ backgroundColor: convertOptions.backgroundColor }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : source === 'PDF' ? (
              <div className="pdf-specific-options" style={{ padding: '0 20px 20px' }}>
                <div 
                  className="option-group-header" 
                  onClick={() => setIsPdfPagesExpanded(!isPdfPagesExpanded)}
                  style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ fontSize: '15px', color: '#334155', fontWeight: '500' }}>Page Selection</span>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="2"
                    style={{ transform: isPdfPagesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {isPdfPagesExpanded && (
                  <div className="sub-option" style={{ marginTop: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Select Pages</label>
                    <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                      <select 
                        value={convertOptions.pdfPageSelection}
                        onChange={(e) => setConvertOptions({...convertOptions, pdfPageSelection: e.target.value})}
                        style={{ 
                          width: '100%',
                          padding: '12px',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#1e293b',
                          backgroundColor: '#fff',
                          appearance: 'none',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option>All Pages</option>
                        <option>Page Range</option>
                        <option>Specific Pages</option>
                      </select>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 16 16" 
                        fill="#94a3b8" 
                        style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none'
                        }}
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </div>
                  </div>
                )}

                {['JPG', 'BMP', 'WEBP'].includes(target) && (
                  <div className="sub-option" style={{ marginTop: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Quality (1-100)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={convertOptions.quality}
                      onChange={(e) => setConvertOptions({...convertOptions, quality: parseInt(e.target.value)})}
                      style={{ width: '100%', marginBottom: '8px' }}
                    />
                    <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      {convertOptions.quality}%
                    </div>
                  </div>
                )}

                {target === 'GIF' && (
                  <>
                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Animation Delay (ms)</label>
                      <input 
                        type="number" 
                        value={convertOptions.animationDelay}
                        onChange={(e) => setConvertOptions({...convertOptions, animationDelay: parseInt(e.target.value)})}
                        style={{ 
                          width: '100%',
                          padding: '12px',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#1e293b',
                          backgroundColor: '#f8fafc',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div className="sub-option" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        id="loop-animation"
                        checked={convertOptions.loopAnimation}
                        onChange={(e) => setConvertOptions({...convertOptions, loopAnimation: e.target.checked})}
                        style={{ 
                          width: '18px', 
                          height: '18px', 
                          cursor: 'pointer',
                          accentColor: '#00a3ff'
                        }}
                      />
                      <label htmlFor="loop-animation" style={{ color: '#334155', fontWeight: '500', cursor: 'pointer', fontSize: '15px' }}>Loop Animation</label>
                    </div>
                  </>
                )}
              </div>
            ) : source === 'TXT' ? (
              <div className="txt-specific-options" style={{ padding: '0 20px 20px' }}>
                {target === 'SPEECH' && (
                  <div className="speech-options">
                    <div className="sub-option" style={{ marginTop: '10px' }}>
                      <label style={{ color: '#334155', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Speech Speed</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.0" 
                        step="0.1"
                        value={convertOptions.speechSpeed}
                        onChange={(e) => setConvertOptions({...convertOptions, speechSpeed: parseFloat(e.target.value)})}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        {convertOptions.speechSpeed}x
                      </div>
                    </div>

                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '600', marginBottom: '12px', display: 'block' }}>Speech Pitch</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="2.0" 
                        step="0.1"
                        value={convertOptions.speechPitch}
                        onChange={(e) => setConvertOptions({...convertOptions, speechPitch: parseFloat(e.target.value)})}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        {convertOptions.speechPitch}
                      </div>
                    </div>

                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Speech Language</label>
                      <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                        <select 
                          value={convertOptions.speechLanguage}
                          onChange={(e) => setConvertOptions({...convertOptions, speechLanguage: e.target.value})}
                          style={{ 
                            width: '100%',
                            padding: '12px',
                            border: '1.5px solid #00a3ff',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#1e293b',
                            backgroundColor: '#fff',
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: '0 0 0 1px rgba(0, 163, 255, 0.1)'
                          }}
                        >
                          <option>English</option>
                          <option>Chinese (Mandarin)</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 16 16" 
                          fill="#94a3b8" 
                          style={{ 
                            position: 'absolute', 
                            right: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                          }}
                        >
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                {target === 'PDF' && (
                  <>
                    <div className="sub-option" style={{ marginTop: '10px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '8px', display: 'block', fontSize: '15px' }}>Page Size</label>
                      <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                        <select 
                          value={convertOptions.pageSize}
                          onChange={(e) => setConvertOptions({...convertOptions, pageSize: e.target.value})}
                          style={{ 
                            width: '100%',
                            padding: '12px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#1e293b',
                            backgroundColor: '#fff',
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option>A4</option>
                          <option>Letter</option>
                          <option>A3</option>
                          <option>Legal</option>
                        </select>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 16 16" 
                          fill="#94a3b8" 
                          style={{ 
                            position: 'absolute', 
                            right: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                          }}
                        >
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                    </div>

                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '8px', display: 'block', fontSize: '15px' }}>Orientation</label>
                      <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                        <select 
                          value={convertOptions.orientation}
                          onChange={(e) => setConvertOptions({...convertOptions, orientation: e.target.value})}
                          style={{ 
                            width: '100%',
                            padding: '12px',
                            border: '1.5px solid #00a3ff',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#1e293b',
                            backgroundColor: '#fff',
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: '0 0 0 1px rgba(0, 163, 255, 0.1)'
                          }}
                        >
                          <option>Portrait</option>
                          <option>Landscape</option>
                        </select>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 16 16" 
                          fill="#94a3b8" 
                          style={{ 
                            position: 'absolute', 
                            right: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                          }}
                        >
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                    </div>
                  </>
                )}

                {['JPG', 'PNG'].includes(target) && (
                  <>
                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>Quality (1-100)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={convertOptions.quality}
                        onChange={(e) => setConvertOptions({...convertOptions, quality: parseInt(e.target.value)})}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        {convertOptions.quality}%
                      </div>
                    </div>

                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>Background Color</label>
                      <div className="color-picker-wrapper" style={{ 
                        width: '56px', 
                        height: '28px', 
                        padding: '3px',
                        border: '1px solid #94a3b8',
                        borderRadius: '2px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <input 
                          type="color" 
                          value={convertOptions.backgroundColor}
                          onChange={(e) => setConvertOptions({...convertOptions, backgroundColor: e.target.value})}
                          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 1 }}
                        />
                        <div 
                          className="color-preview" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            backgroundColor: convertOptions.backgroundColor,
                            border: '1px solid #e2e8f0',
                            borderRadius: '1px'
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : source === 'JSON' ? (
              <div className="json-specific-options">
                {target === 'CSV' && (
                  <div className="option-group-content" style={{ padding: '20px' }}>
                    <div className="sub-option">
                      <label>CSV Delimiter</label>
                      <select 
                        value={convertOptions.csvDelimiter}
                        onChange={(e) => setConvertOptions({...convertOptions, csvDelimiter: e.target.value})}
                        style={{ 
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          paddingRight: '32px'
                        }}
                      >
                        <option>Comma (,)</option>
                        <option>Semicolon (;)</option>
                        <option>Tab</option>
                        <option>Pipe (|)</option>
                      </select>
                    </div>
                  </div>
                )}

                {target === 'JPG' && (
                  <div className="option-group-content static-options" style={{ padding: '20px' }}>
                    <div className="sub-option">
                      <label>Image Quality</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={convertOptions.quality}
                        onChange={(e) => setConvertOptions({...convertOptions, quality: parseInt(e.target.value)})}
                      />
                      <div className="value-label-center" style={{ marginTop: '8px', color: '#94a3b8' }}>
                        {convertOptions.quality}%
                      </div>
                    </div>
                    
                    <div className="sub-option" style={{ marginTop: '12px' }}>
                      <button 
                        className={`orientation-toggle ${convertOptions.orientation === 'Landscape' ? 'active' : ''}`}
                        onClick={() => setConvertOptions({
                          ...convertOptions, 
                          orientation: convertOptions.orientation === 'Landscape' ? 'Portrait' : 'Landscape'
                        })}
                        style={{
                          width: '44px',
                          height: '28px',
                          padding: '0',
                          border: '1px solid #64748b',
                          borderRadius: '2px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '18px',
                          border: '1.5px solid #64748b',
                          borderRadius: '1px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f8fafc',
                          transform: convertOptions.orientation === 'Landscape' ? 'rotate(0deg)' : 'rotate(90deg)',
                          transition: 'transform 0.2s'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.5px'
                          }}></div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {target === 'YAML' && (
                  <div className="option-group-content static-options" style={{ padding: '20px' }}>
                    <div className="sub-option">
                      <label>YAML Indent</label>
                      <input 
                        type="range" 
                        min="2" 
                        max="8" 
                        step="2"
                        value={convertOptions.yamlIndent}
                        onChange={(e) => setConvertOptions({...convertOptions, yamlIndent: parseInt(e.target.value)})}
                      />
                      <div className="value-label-center" style={{ marginTop: '8px', color: '#94a3b8' }}>
                        {convertOptions.yamlIndent}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : source === 'XML' ? (
              <div className="xml-specific-options" style={{ padding: '0 20px 20px' }}>
                {target === 'PDF' && (
                  <>
                    <div className="sub-option" style={{ marginTop: '10px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>Background Color</label>
                      <div className="color-picker-wrapper" style={{ 
                        width: '56px', 
                        height: '28px', 
                        padding: '3px',
                        border: '1px solid #94a3b8',
                        borderRadius: '2px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <input 
                          type="color" 
                          value={convertOptions.backgroundColor}
                          onChange={(e) => setConvertOptions({...convertOptions, backgroundColor: e.target.value})}
                          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 1 }}
                        />
                        <div 
                          className="color-preview" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            backgroundColor: convertOptions.backgroundColor,
                            border: '1px solid #e2e8f0',
                            borderRadius: '1px'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '8px', display: 'block', fontSize: '15px' }}>conv.page_size</label>
                      <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                        <select 
                          value={convertOptions.pageSize}
                          onChange={(e) => setConvertOptions({...convertOptions, pageSize: e.target.value})}
                          style={{ 
                            width: '100%',
                            padding: '12px',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#1e293b',
                            backgroundColor: '#fff',
                            appearance: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option>A4</option>
                          <option>Letter</option>
                          <option>A3</option>
                          <option>Legal</option>
                        </select>
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 16 16" 
                          fill="#94a3b8" 
                          style={{ 
                            position: 'absolute', 
                            right: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                          }}
                        >
                          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                      </div>
                    </div>
                  </>
                )}
                {target === 'JPG' && (
                  <>
                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>Quality (1-100)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={convertOptions.quality}
                        onChange={(e) => setConvertOptions({...convertOptions, quality: parseInt(e.target.value)})}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        {convertOptions.quality}%
                      </div>
                    </div>
                    <div className="sub-option" style={{ marginTop: '20px' }}>
                      <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>Background Color</label>
                      <div className="color-picker-wrapper" style={{ 
                        width: '56px', 
                        height: '28px', 
                        padding: '3px',
                        border: '1px solid #94a3b8',
                        borderRadius: '2px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <input 
                          type="color" 
                          value={convertOptions.backgroundColor}
                          onChange={(e) => setConvertOptions({...convertOptions, backgroundColor: e.target.value})}
                          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 1 }}
                        />
                        <div 
                          className="color-preview" 
                          style={{ 
                            width: '100%',
                            height: '100%',
                            backgroundColor: convertOptions.backgroundColor,
                            border: '1px solid #e2e8f0',
                            borderRadius: '1px'
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                {target === 'CSV' && (
                  <div className="sub-option" style={{ marginTop: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: '500', marginBottom: '8px', display: 'block', fontSize: '15px' }}>CSV</label>
                    <div className="custom-select-wrapper" style={{ position: 'relative' }}>
                      <select 
                        value={convertOptions.csvDelimiter}
                        onChange={(e) => setConvertOptions({...convertOptions, csvDelimiter: e.target.value})}
                        style={{ 
                          width: '100%',
                          padding: '12px',
                          border: '1.5px solid #00a3ff',
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#1e293b',
                          backgroundColor: '#fff',
                          appearance: 'none',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option>Comma (,)</option>
                        <option>Semicolon (;)</option>
                        <option>Tab</option>
                        <option>Pipe (|)</option>
                      </select>
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 16 16" 
                        fill="#94a3b8" 
                        style={{ 
                          position: 'absolute', 
                          right: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none'
                        }}
                      >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                      </svg>
                    </div>
                  </div>
                )}
                {target === 'YAML' && (
                  <div className="sub-option" style={{ marginTop: '20px' }}>
                    <label style={{ color: '#334155', fontWeight: '500', marginBottom: '12px', display: 'block', fontSize: '15px' }}>YAML Indent</label>
                    <input 
                      type="range" 
                      min="2" 
                      max="8" 
                      step="2"
                      value={convertOptions.yamlIndent}
                      onChange={(e) => setConvertOptions({...convertOptions, yamlIndent: parseInt(e.target.value)})}
                      style={{ width: '100%', marginBottom: '8px' }}
                    />
                    <div className="value-label-center" style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      {convertOptions.yamlIndent}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {!['TXT', 'EPUB'].includes(target) && (
                  <div className="option-group-content static-options">
                    <div className="sub-option">
                      <label>Quality (1-100)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={convertOptions.quality}
                        onChange={(e) => setConvertOptions({...convertOptions, quality: e.target.value})}
                      />
                      <span className="value-label-center">{convertOptions.quality}%</span>
                    </div>
                    
                    <div className="sub-option">
                      <label>Background Color</label>
                      <div className="color-picker-wrapper">
                        <input 
                          type="color" 
                          value={convertOptions.backgroundColor}
                          onChange={(e) => setConvertOptions({...convertOptions, backgroundColor: e.target.value})}
                          style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                        <div 
                          className="color-preview" 
                          style={{ backgroundColor: convertOptions.backgroundColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`option-group ${isWatermarkExpanded ? 'expanded' : ''}`}>
                  <div 
                    className="option-group-header" 
                    onClick={() => setIsWatermarkExpanded(!isWatermarkExpanded)}
                  >
                    <span>Watermark Info</span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ transform: isWatermarkExpanded ? 'rotate(180deg)' : 'rotate(0)' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  
                  {isWatermarkExpanded && (
                    <div className="option-group-content">
                      {!['TXT', 'EPUB'].includes(target) && (
                        <>
                          <div className="sub-option">
                            <label>Text</label>
                            <input 
                              type="text" 
                              placeholder=""
                              value={watermarkOptions.text}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, text: e.target.value})}
                            />
                          </div>
                          
                          <div className="sub-option">
                            <label>Font</label>
                            <select 
                              value={watermarkOptions.font}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, font: e.target.value})}
                            >
                              <option>Arial Bold</option>
                              <option>SimSun</option>
                              <option>Microsoft YaHei</option>
                            </select>
                          </div>
                          
                          <div className="sub-option">
                            <label>Color</label>
                            <div className="color-picker-wrapper">
                              <div 
                                className="color-preview" 
                                style={{ backgroundColor: watermarkOptions.color }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="sub-option">
                            <label>Size</label>
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={watermarkOptions.size}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, size: e.target.value})}
                            />
                            <span className="value-label-center">{watermarkOptions.size}</span>
                          </div>
                          
                          <div className="sub-option">
                            <label>Opacity</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={watermarkOptions.opacity}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, opacity: e.target.value})}
                            />
                            <span className="value-label-center">{watermarkOptions.opacity}%</span>
                          </div>
                          
                          <div className="sub-option">
                            <label>Angle</label>
                            <input 
                              type="range" 
                              min="0" 
                              max="360" 
                              value={watermarkOptions.angle}
                              onChange={(e) => setWatermarkOptions({...watermarkOptions, angle: e.target.value})}
                            />
                            <span className="value-label-center">{watermarkOptions.angle}°</span>
                          </div>
                        </>
                      )}
                      
                      <div className="sub-option">
                        <label>Position</label>
                        <div className="position-grid">
                          {[
                            { pos: 'top-left', icon: <path d="M7 17l10-10M7 7h10v10" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} /> },
                            { pos: 'top', icon: <path d="M12 19V5M5 12l7-7 7 7" /> },
                            { pos: 'top-right', icon: <path d="M7 17l10-10M7 7h10v10" /> },
                            { pos: 'left', icon: <path d="M19 12H5M12 5l-7 7 7 7" /> },
                            { pos: 'center', icon: <g><circle cx="12" cy="12" r="3" strokeWidth="2" /><circle cx="12" cy="12" r="6" strokeWidth="1" /></g> },
                            { pos: 'right', icon: <path d="M5 12h14M12 5l7 7-7 7" /> },
                            { pos: 'bottom-left', icon: <path d="M17 7L7 17M17 17H7V7" /> },
                            { pos: 'bottom', icon: <path d="M12 5v14M5 12l7 7 7-7" /> },
                            { pos: 'bottom-right', icon: <path d="M7 7l10 10M17 7v10H7" /> }
                          ].map(item => (
                            <button 
                              key={item.pos}
                              className={`pos-btn ${watermarkOptions.position === item.pos ? 'active' : ''}`}
                              onClick={() => setWatermarkOptions({...watermarkOptions, position: item.pos})}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                {item.icon}
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </div>

      <div className="action-buttons">
        <button className="btn-action btn-convert" onClick={handleConvert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
          </svg>
          全部转换
        </button>
        <button className="btn-action btn-clear" onClick={handleRemoveFile}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          全部清除
        </button>
        <button className="btn-action btn-download" onClick={() => alert('全部下载')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          全部下载
        </button>
      </div>
    </div>
  );
}

export default ToolDetailContent;
