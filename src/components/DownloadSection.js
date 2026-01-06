import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadSection.css';
import downloadImage from '../assets/next rental await left side.png';

const DownloadSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="download-section">
      <div className="download-container">
        <div className="download-image">
          <img src={downloadImage} alt="Car rental" />
        </div>
        <div className="download-content">
          <div className="download-header">
            {/* <div className="logo-badge">S</div> */}
            <div className="download-text">
              <div className="download-subtitle">PERMIUM CAR RENTAL SERVICE</div>
              <h2 className="download-title">YOUR NEXT RENTAL CAR AWAITS.</h2>
              <p className="download-subtitle-text">Available on Apple App Store and Google Play Store</p>
            </div>
          </div>
          <div className="download-buttons">
            <button
              className="download-button primary"
              onClick={() => { window.location.href = '/products-sharefox'; }}
            >
              Find your car
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;

