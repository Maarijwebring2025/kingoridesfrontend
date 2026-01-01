import React, { useState } from 'react';
import './EmbeddedBookingForm.css';
import { loginShopUser, registerShopUser, addToCart } from '../services/sharefox';
import { SHAREFOX_CONFIG } from '../config/sharefox';

const EmbeddedBookingForm = ({ product }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const [formData, setFormData] = useState({
    // Login/Register fields
    email: '',
    password: '',
    name: '',
    phone: '',
    
    // Booking fields
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await loginShopUser(formData.email, formData.password);
      setUserToken(token);
      setIsLoggedIn(true);
      setSuccess(false);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerShopUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });
      
      // Auto-login after registration
      const token = await loginShopUser(formData.email, formData.password);
      setUserToken(token);
      setIsLoggedIn(true);
      setShowRegister(false);
      setSuccess(false);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.startDate || !formData.endDate) {
      setError('Please select start and end dates.');
      setLoading(false);
      return;
    }

    if (!userToken) {
      setError('Please login or register first.');
      setLoading(false);
      return;
    }

    try {
      const productId = product.id || product.product_id;
      await addToCart(userToken, productId, formData.startDate, formData.endDate);
      
      setSuccess(true);
      setError(null);
      
      // Redirect to ShareFox checkout after a short delay
      setTimeout(() => {
        const checkoutUrl = `${SHAREFOX_CONFIG.bookingBaseUrl}/checkout`;
        window.open(checkoutUrl, '_blank');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    const dailyPrice = product.price || product.daily_price || 0;
    return days * dailyPrice;
  };

  const today = new Date().toISOString().split('T')[0];
  const minEndDate = formData.startDate || today;

  return (
    <div className="embedded-booking-form">
      <h2 className="booking-form-title">Book This Vehicle</h2>

      {success && (
        <div className="success-message">
          <p>✓ Successfully added to cart! Redirecting to checkout...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!isLoggedIn ? (
        <div className="auth-section">
          {!showRegister ? (
            <form onSubmit={handleLogin} className="booking-form">
              <h3>Login to Continue</h3>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="auth-switch">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="link-button"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="booking-form">
              <h3>Create Account</h3>
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email *</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">Phone Number</label>
                <input
                  type="tel"
                  id="reg-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password *</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Create a password"
                  minLength={6}
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register & Continue'}
              </button>

              <p className="auth-switch">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="link-button"
                >
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={today}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={minEndDate}
              />
            </div>
          </div>

          {formData.startDate && formData.endDate && (
            <div className="booking-summary">
              <div className="summary-row">
                <span>Rental Period:</span>
                <span>{calculateTotalDays()} day(s)</span>
              </div>
              <div className="summary-row">
                <span>Daily Rate:</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(product.price || product.daily_price || 0)}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(calculateTotalPrice())}
                </span>
              </div>
            </div>
          )}

          <button type="submit" className="submit-button primary" disabled={loading}>
            {loading ? 'Processing...' : 'Add to Cart & Checkout'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLoggedIn(false);
              setUserToken(null);
              setFormData({
                email: formData.email,
                password: '',
                name: formData.name,
                phone: formData.phone,
                startDate: '',
                endDate: '',
              });
            }}
            className="logout-button"
          >
            Logout
          </button>
        </form>
      )}
    </div>
  );
};

export default EmbeddedBookingForm;

