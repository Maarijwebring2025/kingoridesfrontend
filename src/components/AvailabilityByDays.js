import React, { useState, useEffect } from 'react';
import './AvailabilityByDays.css';
import ShareFoxBooking from './ShareFoxBooking';
import mercedesImage from '../assets/mercedes x class.png';
import { initShareFox, getAvailableProducts, getProducts } from '../services/sharefox';
import { SHAREFOX_CONFIG, PRODUCT_IDS } from '../config/sharefox';

const AvailabilityByDays = () => {
  const [selectedDay, setSelectedDay] = useState('One day');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const dayOptions = ['One day', '7 Days', '14 Days', '30 Days'];
  
  // Initialize ShareFox
  useEffect(() => {
    initShareFox(SHAREFOX_CONFIG.shopDomain, SHAREFOX_CONFIG.bookingBaseUrl);
  }, []);

  // Fetch available cars from ShareFox when day selection changes
  useEffect(() => {
    const fetchAvailableCars = async () => {
      setLoading(true);
      try {
        const dates = calculateDates(selectedDay);
        let products = [];
        
        // First try to get available products for the date range
        try {
          products = await getAvailableProducts(dates.start, dates.end);
        } catch (availableError) {
          console.warn('Could not fetch available products, trying all products:', availableError);
          // If available products fails, try fetching all products
          try {
            products = await getProducts();
            // Limit to first 7 products for display
            products = products.slice(0, 7);
          } catch (allProductsError) {
            console.error('Could not fetch products:', allProductsError);
            products = [];
          }
        }
        
        // Map products to car format
        const mappedCars = products.map((product, index) => ({
          id: product.id || product.product_id || `product-${index}`,
          name: product.name || product.title || product.product_name || 'CAR',
          image: product.image || product.thumbnail || product.photo || mercedesImage,
          sharefoxProductId: product.id || product.product_id || null,
          slug: product.slug || product.product_slug || null,
        }));
        
        // If we got products, use them; otherwise use fallback
        if (mappedCars.length > 0) {
          setCars(mappedCars);
        } else {
          // Fallback to default cars if no products available
          const defaultCars = Array(7).fill(null).map((_, index) => ({
            id: `mercedes-${index + 1}`,
            name: 'MERCEDES S-CLASS',
            image: mercedesImage,
            sharefoxProductId: PRODUCT_IDS['MERCEDES S-CLASS'] || null,
          }));
          setCars(defaultCars);
        }
      } catch (error) {
        console.error('Error fetching available cars:', error);
        // Fallback to default cars on error
        const defaultCars = Array(7).fill(null).map((_, index) => ({
          id: `mercedes-${index + 1}`,
          name: 'MERCEDES S-CLASS',
          image: mercedesImage,
          sharefoxProductId: PRODUCT_IDS['MERCEDES S-CLASS'] || null,
        }));
        setCars(defaultCars);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCars();
  }, [selectedDay]);

  const calculateDates = (days) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    
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

  const handleBookingSuccess = (car, bookingData) => {
    console.log('Booking successful:', { car, bookingData });
    // Handle successful booking (e.g., show success message, update UI)
  };

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
          {loading ? (
            <div className="loading-message">Loading available cars...</div>
          ) : (
            <div className="cars-list">
              {cars.map((car, index) => (
                <div key={car.id || index} className="car-card">
                  <img src={car.image} alt={car.name} className="car-image" />
                  <div className="car-name">{car.name}</div>
                  <ShareFoxBooking 
                    car={car}
                    selectedDay={selectedDay}
                    onBookingSuccess={handleBookingSuccess}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AvailabilityByDays;

