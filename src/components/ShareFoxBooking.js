import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShareFoxBooking.css';
import { SHAREFOX_CONFIG } from '../config/sharefox';

const ShareFoxBooking = ({ car, selectedDay, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookNow = () => {
    const productId = car.sharefoxProductId || car.id;
    
    // Navigate to product detail page for embedded booking
    if (productId) {
      navigate(`/products/${productId}`);
    } else {
      // Fallback: Navigate to products page
      navigate('/products');
    }
  };

  return (
    <button 
      className="sharefox-book-button"
      onClick={handleBookNow}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Book Now'}
      <span className="arrow">→</span>
    </button>
  );
};

export default ShareFoxBooking;

