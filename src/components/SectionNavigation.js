import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Controls removed per request
  return null;
};

export default SectionNavigation;

