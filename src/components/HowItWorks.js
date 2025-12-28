import React from 'react';
import './HowItWorks.css';
import findCarIcon from '../assets/find your car.png';
import orderPayIcon from '../assets/order and pay.png';
import carDeliveryIcon from '../assets/car delivery.png';
import changeCarIcon from '../assets/change a car.png';
import rightImage from '../assets/right imagee.png';

const HowItWorks = () => {
  const steps = [
    { id: 1, title: 'Find your car', icon: findCarIcon },
    { id: 2, title: 'Order & Pay', icon: orderPayIcon },
    { id: 3, title: 'Car Delivery', icon: carDeliveryIcon },
    { id: 4, title: 'Change car', icon: changeCarIcon },
  ];

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-content">
          <h2 className="section-title">HOW IT WORKS?</h2>
          <p className="section-description">
            Lorem ipsum dolor sit amet consectetur. Sit sed viverra ut habitasse quis sed.
          </p>
          
          <div className="steps-list">
            {steps.map((step) => (
              <div key={step.id} className="step-item">
                <img src={step.icon} alt={step.title} className="step-icon" />
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>

          <button className="subscribe-button">
            Subscribe to a car
            <span className="arrow-icon">→</span>
          </button>
        </div>

        <div className="how-it-works-image">
          <img src={rightImage} alt="Car rental" className="main-image" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

