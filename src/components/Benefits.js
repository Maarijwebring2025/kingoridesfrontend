import React from 'react';
import './Benefits.css';
import summerIcon from '../assets/summer.png';
import homeIcon from '../assets/home.png';
import noExtraIcon from '../assets/no extra.png';
import newTiresIcon from '../assets/new tires.png';
import insuranceIcon from '../assets/insurance.png';

const Benefits = () => {
  const benefits = [
    { 
      id: 1, 
      title: 'SUMMER/WINTER WH...', 
      description: 'Lorem ipsum dolor sit amet consectetur, Felis velit volutpat nisl adipiscing sed',
      icon: summerIcon
    },
    { 
      id: 2, 
      title: 'HOME DELIVERY', 
      description: 'Lorem ipsum dolor sit amet consectetur, Felis velit volutpat nisl adipiscing sed',
      icon: homeIcon
    },
    { 
      id: 3, 
      title: 'NO EXTRA COSTS', 
      description: 'Lorem ipsum dolor sit amet consectetur, Felis velit volutpat nisl adipiscing sed',
      icon: noExtraIcon
    },
    { 
      id: 4, 
      title: 'NEW TIRES WHEN WO...', 
      description: 'Lorem ipsum dolor sit amet consectetur, Felis velit volutpat nisi adipiscing sed',
      icon: newTiresIcon
    },
    { 
      id: 5, 
      title: 'INSURANCE INCLUDED', 
      description: 'Lorem ipsum dolor sit amet consectetur, Felis velit volutpat nisl adipiscing sed',
      icon: insuranceIcon
    },
  ];

  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <h2 className="section-title">BENEFITS</h2>
        <p className="section-description">
          Lorem ipsum dolor sit amet consectetur. Sit sed viverra ut habitasse quis sed.
        </p>
        
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <img src={benefit.icon} alt={benefit.title} className="benefit-icon" />
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

