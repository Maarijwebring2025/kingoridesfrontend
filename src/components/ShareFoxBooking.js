import React, { useState } from 'react';
import './ShareFoxBooking.css';
import { openShareFoxBooking, getBookingUrl } from '../services/sharefox';
import { SHAREFOX_CONFIG, PRODUCT_SLUGS } from '../config/sharefox';

const ShareFoxBooking = ({ car, selectedDay, onBookingSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
  });

  // Calculate dates based on selected day
  const calculateDates = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // Start tomorrow
    
    const endDate = new Date(startDate);
    
    if (days === 'One day') {
      endDate.setDate(startDate.getDate());
    } else if (days === '7 Days') {
      endDate.setDate(startDate.getDate() + 6);
    } else if (days === '14 Days') {
      endDate.setDate(startDate.getDate() + 13);
    } else if (days === '30 Days') {
      endDate.setDate(startDate.getDate() + 29);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };
  };

  const handleBookNow = () => {
    const dates = calculateDates(selectedDay);
    const productId = car.sharefoxProductId || car.id;
    
    // If ShareFox product ID exists, open ShareFox booking widget
    if (productId) {
      openShareFoxBooking({
        productId: productId.toString(),
        startDate: dates.start,
        endDate: dates.end,
        productName: car.name, // Pass car name to generate slug
        slugMap: PRODUCT_SLUGS, // Pass slug mapping
      });
    } else {
      // Fallback: Show booking modal/form
      setBookingData({
        ...bookingData,
        startDate: dates.start,
        endDate: dates.end,
      });
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productId = car.sharefoxProductId || car.id;
      
      // If ShareFox product ID exists, redirect to ShareFox booking page
      if (productId) {
        const bookingUrl = getBookingUrl(
          productId.toString(),
          bookingData.startDate,
          bookingData.endDate,
          null, // productSlug - will use mapping or generate from productName
          car.name, // productName - used to generate slug if no mapping
          PRODUCT_SLUGS // slugMap - product ID to slug mappings
        );
        window.location.href = bookingUrl;
      } else {
        // Fallback: Show success message and handle booking
        console.log('Booking data:', { car, bookingData });
        alert('Booking request submitted! You will be redirected to complete your booking.');
        if (onBookingSuccess) {
          onBookingSuccess(car, bookingData);
        }
        setShowBookingModal(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <button 
        className="sharefox-book-button"
        onClick={handleBookNow}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Book Now'}
        <span className="arrow">→</span>
      </button>

      {showBookingModal && (
        <div className="sharefox-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="sharefox-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="sharefox-modal-close"
              onClick={() => setShowBookingModal(false)}
            >
              ×
            </button>
            
            <h2 className="sharefox-modal-title">Book {car.name}</h2>
            <p className="sharefox-modal-subtitle">Rental Period: {selectedDay}</p>
            
            <form onSubmit={handleBookingSubmit} className="sharefox-booking-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    required
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="sharefox-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareFoxBooking;

