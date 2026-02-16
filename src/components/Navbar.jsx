import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onFlipTiles }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Gets the current URL path
  
  const [activeTab, setActiveTab] = useState('Home');
  const [pillStyle, setPillStyle] = useState({ opacity: 0 });
  const tabsRef = useRef([]);

  const tabs = ['Home', 'Contact us', 'Flip Tiles'];

  // 1. Sync the active tab with the current URL when the page loads or changes
  useEffect(() => {
    if (location.pathname === '/contact') {
      setActiveTab('Contact us');
    } else if (location.pathname === '/') {
      setActiveTab('Home');
    }
  }, [location.pathname]);

  const movePill = (index) => {
    const activeElement = tabsRef.current[index];
    if (activeElement) {
      setPillStyle({
        left: `${activeElement.offsetLeft}px`,
        width: `${activeElement.offsetWidth}px`,
        opacity: 1,
      });
    }
  };

  const handleTabClick = (tab, index) => {
    setActiveTab(tab);
    movePill(index);

    // 2. Route the user based on which tab they clicked
    if (tab === 'Home') {
      navigate('/');
    } else if (tab === 'Contact us') {
      navigate('/contact');
    } else if (tab === 'Flip Tiles' && onFlipTiles) {
      // Stays on current page and triggers the flip animation
      onFlipTiles();
    }
  };

  useEffect(() => {
    const activeIndex = tabs.indexOf(activeTab);
    if (activeIndex !== -1) {
      // Adding a tiny timeout ensures the DOM is ready to calculate widths after a route change
      setTimeout(() => movePill(activeIndex), 50); 
    }
    
    const handleResize = () => movePill(tabs.indexOf(activeTab));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  return (
    <header className="header-container">
      <nav className="navbar">
        <div className="nav-links">
          
          <div className="gliding-pill" style={pillStyle} />

          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab, index)}
            >
              {tab}
            </button>
          ))}
          
        </div>
      </nav>
    </header>
  );
};

export default Navbar;