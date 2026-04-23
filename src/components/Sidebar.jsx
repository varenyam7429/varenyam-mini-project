import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
    ), section: 'Main' },
    { id: 'fridge', label: 'My Fridge', icon: (
      <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5zm4 2a1 1 0 00-1 1v4a1 1 0 002 0V5a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v2a1 1 0 002 0V5a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
    ) },
    { id: 'recipes', label: 'Recipes', icon: (
      <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
    ) },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">
        <div className="logo-mark">FridgeMatch</div>
        <div className="logo-sub">Recipe Intelligence</div>
      </div>
      <div className="nav">
        {navItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.section && <div className="nav-section">{item.section}</div>}
            <div
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
