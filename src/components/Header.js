import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import carIcon from '../assets/search for a car (1).png';
import scheduleIcon from '../assets/schedule.png';

const Header = ({ searchTerm, setSearchTerm, rentalDays, setRentalDays, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isProductsPage = location.pathname === '/products';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <header className="header">
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
      <div className="header-top">
        <div className="header-container">
          <Link to="/" className="logo-section">
            <img src={logo} alt="KINGO RIDES" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-kingo">KINGO</span>
              <span className="logo-rides">RIDES</span>
            </div>
          </Link>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>FIND A CAR</Link>
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
      
      {isProductsPage && (
        <div className="search-bar-container">
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <div className="search-input-group">
                <img src={carIcon} alt="Car" className="search-icon car-icon" />
                <input 
                  type="text" 
                  placeholder="Search for a car" 
                  className="search-input"
                  value={searchTerm || ''}
                  onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && onSearch) {
                      onSearch();
                    }
                  }}
                />
              </div>
              
              <div className="search-input-group">
                <img src={scheduleIcon} alt="Schedule" className="search-icon schedule-icon" />
                <select 
                  className="search-input"
                  value={rentalDays || '7 Days'}
                  onChange={(e) => setRentalDays && setRentalDays(e.target.value)}
                  style={{ appearance: 'none', paddingRight: '2rem' }}
                >
                  <option value="1 Day">1 Day</option>
                  <option value="7 Days">7 Days</option>
                  <option value="14 Days">14 Days</option>
                  <option value="30 Days">30 Days</option>
                </select>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
            <button className="search-button" onClick={handleSearchClick}>Search</button>
          </div>
        </div>
      )}
      
      {!isProductsPage && (
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
      )}
    </header>
  );
};

export default Header;
