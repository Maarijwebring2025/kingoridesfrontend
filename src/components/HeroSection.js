import React from 'react';
import './HeroSection.css';
import section1Image from '../assets/section1.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={section1Image} alt="Hero Background" className="hero-bg-image" />
      </div>
      
      <div className="hero-content">
        <div className="hero-text-overlay">
          <div className="hero-subtitle">PERMIUM CAR RENTAL SERVICE</div>
          <div className="hero-main-title">
            <span className="hero-title-line1">SUBSCRIBE TO</span>
            <span className="hero-title-line2">RENTAL CARS.</span>
          </div>
          <div className="hero-description">
            Experience premium car rental services with flexible subscription plans. Choose from our wide selection of vehicles and enjoy hassle-free rentals with full insurance coverage and 24/7 support.
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

