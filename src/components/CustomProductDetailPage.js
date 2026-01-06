import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import Header from './Header';
import Footer from './Footer';

const CustomProductDetailPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  return (
    <div className="product-detail-page">
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-header">
          <button onClick={() => navigate('/products')} className="back-button">
            ← Back to Products
          </button>
          <h1 className="product-detail-title">Vehicle Details</h1>
          <p className="product-detail-subtitle">Explore this vehicle's specifications and pricing</p>
        </div>

        {!product ? (
          <div className="sharefox-embed-wrapper">
            <div className="product-actions">
              <button
                onClick={() => navigate('/products')}
                className="action-button back-to-products"
              >
                Back to Products
              </button>
            </div>
            <div className="sharefox-product-embed-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ color: '#ffffff', textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ margin: 0 }}>Product details unavailable</h3>
                <p style={{ opacity: 0.7 }}>Please go back and select the vehicle again.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="sharefox-embed-wrapper">
            <div className="product-actions">
              <button
                onClick={() => window.location.href = '/products-sharefox'}
                className="action-button open-full-view"
              >
                See Live Availability
              </button>
              <button
                onClick={() => navigate('/products')}
                className="action-button back-to-products"
              >
                Back to Products
              </button>
            </div>

            <div className="sharefox-product-embed-container" style={{ padding: '1.25rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr',
                gap: '1.5rem',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1.5px solid rgba(255, 107, 53, 0.2)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x500?text=Car+Image';
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                      {product.brand}
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff' }}>
                      {product.model}
                    </div>
                    <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                      {product.description || 'Premium vehicle with great comfort and performance.'}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>Engine</div>
                    <div style={{ color: '#ffffff', textAlign: 'right' }}>{product.engine} CC</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>Seats</div>
                    <div style={{ color: '#ffffff', textAlign: 'right' }}>{product.seats}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>Transmission</div>
                    <div style={{ color: '#ffffff', textAlign: 'right' }}>{product.transmission || 'Automatic'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>Drive</div>
                    <div style={{ color: '#ffffff', textAlign: 'right' }}>{product.drive || 'FWD'}</div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Starting</span>
                      <span style={{ color: '#ff6b35', fontSize: '1.75rem', fontWeight: 700 }}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(product.price)}
                      </span>
                    </div>
                    <button
                      className="action-button open-full-view"
                      onClick={() => window.location.href = '/products-sharefox'}
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomProductDetailPage;

