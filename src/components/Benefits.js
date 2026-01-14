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
      description: 'Our vehicles are equipped with appropriate tires for seasonal conditions, ensuring safe driving year-round.',
      icon: summerIcon
    },
    { 
      id: 2, 
      title: 'HOME DELIVERY', 
      description: 'Get your rental car delivered directly to your doorstep for maximum convenience and time savings.',
      icon: homeIcon
    },
    { 
      id: 3, 
      title: 'NO EXTRA COSTS', 
      description: 'Transparent pricing with no hidden fees. All essential services and insurance are included in your rental.',
      icon: noExtraIcon
    },
    { 
      id: 4, 
      title: 'NEW TIRES WHEN WO...', 
      description: 'All vehicles feature quality tires with proper tread depth, regularly inspected and replaced when needed.',
      icon: newTiresIcon
    },
    { 
      id: 5, 
      title: 'INSURANCE INCLUDED', 
      description: 'Comprehensive insurance coverage is included with every rental, protecting you and the vehicle.',
      icon: insuranceIcon
    },
  ];

  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <h2 className="section-title">BENEFITS</h2>
        <p className="section-description">
          Discover the advantages of renting with Kingo Rides. From seasonal tire preparation to home delivery, we provide exceptional service and value.
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

