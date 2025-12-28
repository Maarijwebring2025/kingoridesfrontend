import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-column">
            <h3 className="footer-heading">KINGO RIDES</h3>
            <ul className="footer-links">
              <li><a href="#find-car">Find your Car</a></li>
              <li><a href="#list-car">List your car</a></li>
              <li><a href="#lorem1">Lorem ipsum</a></li>
              <li><a href="#lorem2">Lorem ipsum</a></li>
              <li><a href="#lorem3">Lorem ipsum</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">LEGAL</h3>
            <ul className="footer-links">
              <li><a href="#terms">Terms</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#legal">Legal Requirements</a></li>
            </ul>
          </div>

          <div className="footer-column footer-column-wide">
            <div className="newsletter-section">
              <h3 className="footer-heading">NEWSLETTER</h3>
              <p className="newsletter-description">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.
              </p>
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  placeholder="Enter Email" 
                  className="newsletter-input"
                />
                <button className="newsletter-button">Subscribe</button>
              </div>
            </div>

            <div className="socials-section">
              <h3 className="footer-heading">SOCIALS</h3>
              <div className="social-icons">
                <a href="#telegram" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#twitter" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" fill="currentColor"/>
                  </svg>
                </a>
                <a href="#youtube" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" fill="currentColor"/>
                    <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="#000"/>
                  </svg>
                </a>
                <a href="#discord" className="social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-middle">
        <div className="footer-container">
          <div className="footer-logo-section">
            <img src={logo} alt="KINGO RIDES" className="footer-logo" />
            <span className="footer-logo-text">KINGO RIDES</span>
          </div>
          </div>
          <p className="footer-description">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero tempor invidunt ut labore et dolore.
          </p>
        
      </div>

      <div className="footer-bottom-bar"></div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright-text">
            Copyrights <span className="copyright-symbol">©</span> 2025. BIMM.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

