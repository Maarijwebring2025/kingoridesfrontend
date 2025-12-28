import React, { useRef, useEffect } from 'react';
import './SectionNavigation.css';

const SectionNavigation = () => {
  const carsScrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (carsScrollContainerRef.current) {
      carsScrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carsScrollContainerRef.current) {
      carsScrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  // Attach ref to the cars scroll container
  useEffect(() => {
    const carsContainer = document.querySelector('.cars-scroll-container');
    if (carsContainer) {
      carsScrollContainerRef.current = carsContainer;
    }
  }, []);

  return (
    <div className="section-navigation">
      <div className="navigation-container">
        <a href="#view-all" className="view-all-link">VIEW ALL</a>
        <div className="nav-buttons-container">
          <button className="nav-button nav-button-left" onClick={scrollLeft}>‹</button>
          <button className="nav-button nav-button-right" onClick={scrollRight}>›</button>
        </div>
      </div>
    </div>
  );
};

export default SectionNavigation;

