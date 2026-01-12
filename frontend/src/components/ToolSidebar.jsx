import '../App.css';

function ToolSidebar({ sections, activeSection, onSectionClick }) {
  if (!sections) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-list">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`sidebar-item ${activeSection?.name === section.name ? 'active' : ''}`}
            onClick={() => onSectionClick(section)}
          >
            {section.name}
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="ad-banner-sidebar">
          AD (2:3)
        </div>
      </div>
    </aside>
  );
}

export default ToolSidebar;
