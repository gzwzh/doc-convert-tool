import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdBanner from './AdBanner';
import SoftwareCustomization from './SoftwareCustomization';
import QuestionFeedback from './QuestionFeedback';
import '../App.css';

function ToolSidebar({ sections, activeSection, onSectionClick, onToolClick }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !sections) {
      return [];
    }
    const results = [];
    sections.forEach(section => {
      if (section.tools) {
        section.tools.forEach(tool => {
          if (tool.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({ ...tool, section });
          }
        });
      }
    });
    return results;
  }, [searchTerm, sections]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(!!value.trim());
  };

  const handleSearchResultClick = (result) => {
    // 1. Clear search
    setSearchTerm('');
    setShowDropdown(false);
    
    // 2. Notify parent
    if (onToolClick) {
      onToolClick(result, result.section);
    }
  };

  if (!sections) return null;

  return (
    <aside className="sidebar">
      {/* Search Box */}
      <div className="sidebar-search-wrapper" ref={searchRef}>
        <div className="sidebar-search-input-container">
          <svg className="sidebar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder={t('sidebar.search_placeholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchTerm.trim()) setShowDropdown(true);
            }}
          />
        </div>

        {/* Dropdown Results */}
        {showDropdown && (
          <div className="search-results-dropdown">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div 
                  key={`${result.section.name}-${result.name}-${index}`}
                  className="search-result-item"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <span className="search-result-name">
                    {result.name.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === searchTerm.toLowerCase() ? <span key={i} className="search-result-match">{part}</span> : part
                    )}
                  </span>
                  <span className="search-result-category">{t(`categories.${result.section.name}`)}</span>
                </div>
              ))
            ) : (
              <div className="search-no-results">{t('sidebar.no_results')}</div>
            )}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div 
            key={section.name}
            className={`sidebar-item ${activeSection?.name === section.name ? 'active' : ''}`}
            onClick={() => onSectionClick(section)}
          >
            <span className="sidebar-text">{t(`categories.${section.name}`)}</span>
            {activeSection?.name === section.name && (
              <svg className="sidebar-active-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </div>
        ))}
      </nav>

      {/* 底部功能区 */}
      <div className="sidebar-bottom-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SoftwareCustomization />
        <QuestionFeedback />
      </div>
      
      <AdBanner
          positions={['adv_position_04', 'adv_position_05']}
          ratio={2/3}
          placeholderLabel="AD (2:3)"
          interval={5000}
          width="100%"
        />
    </aside>
  );
}

export default ToolSidebar;
