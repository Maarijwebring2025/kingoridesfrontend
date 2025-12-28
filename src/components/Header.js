import React, { useState } from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import carIcon from '../assets/search for a car (1).png';
import scheduleIcon from '../assets/schedule.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
      <div className="header-top">
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="KINGO RIDES" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-kingo">KINGO</span>
              <span className="logo-rides">RIDES</span>
            </div>
          </div>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#find-car" className="nav-link" onClick={() => setIsMenuOpen(false)}>FIND A CAR</a>
            <a href="#packages" className="nav-link" onClick={() => setIsMenuOpen(false)}>PACKAGES</a>
            <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>CONTACT US</a>
          </nav>

          <div className={`account-section ${isMenuOpen ? 'active' : ''}`}>
            <button className="my-account-btn">My account</button>
            <button className="create-account-btn">Create an account</button>
          </div>

          <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
      
      <div className="search-bar-container">
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <div className="search-input-group">
              <img src={carIcon} alt="Car" className="search-icon car-icon" />
              <input 
                type="text" 
                placeholder="Search for a car" 
                className="search-input"
              />
            </div>
            
            <div className="search-input-group">
              <img src={scheduleIcon} alt="Schedule" className="search-icon schedule-icon" />
              <input 
                type="text" 
                placeholder="Subscription Period" 
                className="search-input"
              />
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
          <button className="search-button">Search</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
