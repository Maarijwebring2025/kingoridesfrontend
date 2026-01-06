import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PackagesPage.css';
import Header from './Header';
import Footer from './Footer';

const PackagesPage = () => {
  const navigate = useNavigate();

  const packages = [
    {
      id: 1,
      name: 'DAILY RENTAL',
      duration: '1-7 Days',
      price: 'Starting from $49/day',
      features: [
        'Flexible daily rates',
        'Full insurance coverage',
        '24/7 roadside assistance',
        'Free cancellation',
        'Home delivery available'
      ],
      popular: false
    },
    {
      id: 2,
      name: 'WEEKLY PACKAGE',
      duration: '7-14 Days',
      price: 'Starting from $299/week',
      features: [
        'Best value for weekly rentals',
        'Comprehensive insurance included',
        'Unlimited mileage',
        'Free maintenance service',
        'Priority customer support'
      ],
      popular: true
    },
    {
      id: 3,
      name: 'MONTHLY SUBSCRIPTION',
      duration: '30+ Days',
      price: 'Starting from $999/month',
      features: [
        'Long-term rental solution',
        'All-inclusive pricing',
        'Vehicle swap option',
        'Dedicated account manager',
        'Special discounts on extensions'
      ],
      popular: false
    },
    {
      id: 4,
      name: 'PREMIUM LUXURY',
      duration: 'Custom',
      price: 'Contact for pricing',
      features: [
        'Luxury vehicle selection',
        'Premium concierge service',
        'Personal driver option',
        'Airport pickup/dropoff',
        'VIP treatment'
      ],
      popular: false
    },
    {
      id: 5,
      name: 'BUSINESS FLEET',
      duration: 'Corporate',
      price: 'Volume discounts',
      features: [
        'Multiple vehicle solutions',
        'Corporate billing options',
        'Fleet management tools',
        'Dedicated support team',
        'Customized agreements'
      ],
      popular: false
    },
    {
      id: 6,
      name: 'WEEKEND SPECIAL',
      duration: 'Friday-Monday',
      price: 'Starting from $149',
      features: [
        'Weekend getaway package',
        'Special weekend rates',
        'Early pickup available',
        'Late return option',
        'Perfect for short trips'
      ],
      popular: false
    }
  ];

  return (
    <div className="packages-page">
      <Header />
      <div className="packages-container">
        <div className="packages-header">
          <h1 className="packages-title">RENTAL PACKAGES</h1>
          <p className="packages-subtitle">
            Choose the perfect rental package that fits your needs. From daily rentals to long-term subscriptions, we have options for everyone.
          </p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}
              <div className="package-header">
                <h3 className="package-name">{pkg.name}</h3>
                <p className="package-duration">{pkg.duration}</p>
              </div>
              
              <div className="package-price">
                {pkg.price}
              </div>

              <ul className="package-features">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="package-feature">
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className="package-button"
                onClick={() => navigate('/products-sharefox')}
              >
                View Available Cars
              </button>
            </div>
          ))}
        </div>

        <div className="packages-info">
          <div className="info-card">
            <h3 className="info-title">Need Help Choosing?</h3>
            <p className="info-description">
              Our team is here to help you find the perfect rental package. Contact us for personalized recommendations based on your needs.
            </p>
            <button 
              className="info-button"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackagesPage;
