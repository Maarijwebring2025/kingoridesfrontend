import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import { SHAREFOX_CONFIG, PRODUCT_SLUGS } from '../config/sharefox';
import Header from './Header';
import Footer from './Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const scriptLoadedRef = React.useRef(false);

  useEffect(() => {
    // Load ShareFox Embed script
    const loadShareFoxEmbed = () => {
      if (scriptLoadedRef.current) return;

      // Check if script already exists
      const existingScript = document.getElementById('sharefox-embed-script');
      if (existingScript) {
        scriptLoadedRef.current = true;
        return;
      }

      // Extract shop name from domain
      const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');
      
      // Create and append the ShareFox embed script
      const script = document.createElement('script');
      script.id = 'sharefox-embed-script';
      script.setAttribute('data-shop', shopName);
      script.src = `https://${shopName}.mysharefox.com/embed.min.js`;
      script.async = true;
      
      script.onload = () => {
        console.log('ShareFox Embed script loaded successfully');
        scriptLoadedRef.current = true;
      };
      
      script.onerror = () => {
        console.error('Failed to load ShareFox Embed script');
      };

      document.body.appendChild(script);
    };

    loadShareFoxEmbed();
  }, []);

  // Extract shop name from domain
  const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');
  
  // Get product slug from config or use productId
  const productSlug = PRODUCT_SLUGS?.[productId] || 'tesla-y';
  
  // Redirect to ShareFox product page with desktop view parameter
  const shareFoxProductUrl = `${SHAREFOX_CONFIG.bookingBaseUrl}/products/${productId}/${productSlug}?desktop=true`;
  
  // Full view URL for product 1010
  const shareFoxFullViewUrl = `${SHAREFOX_CONFIG.bookingBaseUrl}/products/1010/tesla-y?desktop=true`;

  return (
    <div className="product-detail-page">
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-header">
          <button onClick={() => navigate('/products')} className="back-button">
            ← Back to Products
          </button>
          <h1 className="product-detail-title">Product Details</h1>
          <p className="product-detail-subtitle">View and book this vehicle</p>
        </div>

        <div className="sharefox-embed-wrapper">
          <div className="product-actions">
            <button 
              onClick={() => window.location.href = shareFoxFullViewUrl}
              className="action-button open-full-view"
            >
              Open Full View
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="action-button back-to-products"
            >
              Back to Products
            </button>
          </div>
          <div className="sharefox-product-embed-container">
            <iframe
              src={shareFoxProductUrl}
              className="sharefox-product-iframe"
              title="Product Details"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
