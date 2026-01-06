import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ProductsPage.css';
import { SHAREFOX_CONFIG } from '../config/sharefox';
import Header from './Header';
import Footer from './Footer';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [rentalDays, setRentalDays] = useState('7 Days');
  const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');
  const shareFoxSearchUrl = `${SHAREFOX_CONFIG.bookingBaseUrl}/products?search=${encodeURIComponent(query)}&desktop=true`;
  
  
  const handleSearch = () => {
    if (searchTerm && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Update search term when URL query changes
  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const handleProductClick = (product) => {
    const productId = product.id || product.product_id;
    if (productId) {
      navigate(`/products/${productId}`);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="products-page">
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        rentalDays={rentalDays}
        setRentalDays={setRentalDays}
        onSearch={handleSearch}
      />
      <div className="products-page-container">
        <div className="products-content-wrapper">
          <main className="products-main-content" style={{ flex: 1 }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 className="results-title">
                {query 
                  ? `Search results for '${query}'`
                  : 'Search for a car'
                }
              </h2>
            </div>
            
            {query ? (
              <div className="sharefox-embed-wrapper">
                <div className="sharefox-product-embed-container">
                  <iframe
                    src={shareFoxSearchUrl}
                    className="sharefox-product-iframe"
                    title="Search Results"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'rgba(255, 255, 255, 0.6)',
              }}>
                Enter a search term to find cars
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
