import React, { useState } from 'react';
import './AvailabilityByDays.css';
import mercedesImage from '../assets/mercedes x class.png';

const AvailabilityByDays = () => {
  const [selectedDay, setSelectedDay] = useState('One day');
  
  const dayOptions = ['One day', '7 Days', '14 Days', '30 Days'];
  
  const cars = Array(7).fill({
    name: 'MERCEDES S-CLASS',
    image: mercedesImage,
  });

  return (
    <section className="availability-section">
      <div className="availability-container">
        <div className="availability-header">
          <h2 className="section-title">AVAILABILITY BY DAYS</h2>
          <div className="day-buttons">
            {dayOptions.map((day) => (
              <button
                key={day}
                className={`day-button ${selectedDay === day ? 'active' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div className="cars-scroll-container">
          <div className="cars-list">
            {cars.map((car, index) => (
              <div key={index} className="car-card">
                <img src={car.image} alt={car.name} className="car-image" />
                <div className="car-name">{car.name}</div>
                <a href="#book" className="book-link">
                  Book Now
                  <span className="arrow">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailabilityByDays;

