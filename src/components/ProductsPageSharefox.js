import React, { useState, useEffect } from 'react';
import './ProductsPage.css';
import { SHAREFOX_CONFIG } from '../config/sharefox';
import Header from './Header';
import Footer from './Footer';

const ProductsPageSharefox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rentalDays, setRentalDays] = useState('7 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPageReached, setMaxPageReached] = useState(1); // Track highest page user has navigated to
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const productsPerPage = 20;
  
  // Get shop name from domain (e.g., 'kingorides.mysharefox.com' -> 'kingorides')
  const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');
  
  // Load Sharefox Embed script
  useEffect(() => {
    // Always render embeds immediately - script will process them when ready
    setScriptLoaded(true);
    
    // Check if script is already loaded
    const existingScript = document.getElementById('sharefox-embed-script');
    if (existingScript) {
      console.log('Sharefox Embed script already exists');
      // Trigger re-processing of embeds
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
      }, 100);
      return;
    }

    // Create and append the Sharefox embed script
    const script = document.createElement('script');
    script.id = 'sharefox-embed-script';
    script.setAttribute('data-shop', shopName);
    script.src = `https://${shopName}.mysharefox.com/embed.min.js`;
    script.async = true;

    script.onload = () => {
      console.log('Sharefox Embed script loaded successfully');
      // Wait for script to initialize, then trigger processing
      setTimeout(() => {
        const embeds = document.querySelectorAll('.sharefox-embed');
        console.log('Found embeds after script load:', embeds.length);
        // Trigger DOMContentLoaded event to process embeds
        window.dispatchEvent(new Event('DOMContentLoaded'));
      }, 1000);
    };

    script.onerror = () => {
      console.error('Failed to load Sharefox Embed script');
    };

    document.head.appendChild(script);
  }, [shopName]);

  // Re-initialize embeds when component updates or page changes
  useEffect(() => {
    if (scriptLoaded) {
      // Wait for DOM to update with new embeds, then trigger processing
      const initializeEmbeds = () => {
        const embeds = document.querySelectorAll('.sharefox-embed');
        console.log('Found embeds in DOM:', embeds.length);

        // Trigger processing by dispatching DOMContentLoaded event
        // Sharefox script should listen for this and process embeds
        window.dispatchEvent(new Event('DOMContentLoaded'));
        
        // Also try direct initialization if SharefoxEmbed exists
        if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
          console.log('Calling SharefoxEmbed.init()');
          window.SharefoxEmbed.init();
        }
      };

      // Initialize after React renders the embeds
      const timeout1 = setTimeout(initializeEmbeds, 200);
      const timeout2 = setTimeout(initializeEmbeds, 500);
      const timeout3 = setTimeout(initializeEmbeds, 1000);
      const timeout4 = setTimeout(initializeEmbeds, 2000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
      };
    }
  }, [scriptLoaded, currentPage]);

  // Intercept postMessage events and window.open calls from Sharefox iframes
  useEffect(() => {
    // Store original window.open
    const originalWindowOpen = window.open;

    // Override window.open to prevent new tabs
    window.open = function(url, target, features) {
      // If Sharefox tries to open in new tab, open in same tab instead
      if (url && url.includes('mysharefox.com') && url.includes('products')) {
        if (target === '_blank' || target === 'blank') {
          // Navigate in same tab
          window.location.href = url;
          return null;
        }
      }
      // Otherwise, use original window.open
      return originalWindowOpen.call(window, url, target, features);
    };

    // Listen for postMessage events from Sharefox iframes
    const handleMessage = (event) => {
      // Check if message is from Sharefox domain
      if (event.origin && event.origin.includes('mysharefox.com')) {
        // Check for navigation messages
        if (event.data) {
          let url = null;
          
          // Handle different message formats
          if (typeof event.data === 'string') {
            url = event.data;
          } else if (typeof event.data === 'object') {
            url = event.data.url || event.data.href || event.data.navigate || event.data.link;
          }

          // If we found a product URL, navigate in same tab
          if (url && (url.includes('products') || url.includes('mysharefox.com'))) {
            event.preventDefault?.();
            window.location.href = url;
            return false;
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      // Restore original window.open
      window.open = originalWindowOpen;
      window.removeEventListener('message', handleMessage);
    };
  }, [scriptLoaded, currentPage]);

  const handleSearch = () => {
    // Search will be handled by the Sharefox embed itself
    // Redirect to Sharefox search page
    if (searchTerm) {
      const searchUrl = `${SHAREFOX_CONFIG.bookingBaseUrl}/products?search=${encodeURIComponent(searchTerm)}`;
      window.location.href = searchUrl;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Update max page reached when user navigates forward
    if (page > maxPageReached) {
      setMaxPageReached(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages to show dynamically
  // Show pages 1 through maxPageReached + 1 (next page if user has navigated)
  // Minimum 1 page, show more as user navigates
  const totalPagesToShow = Math.max(1, maxPageReached + 1);
  
  // Generate page numbers to display
  const pagesToShow = [];
  for (let i = 1; i <= totalPagesToShow; i++) {
    pagesToShow.push(i);
  }

  // Calculate products to show for current page
  // Offset for products based on current page (20 products per page)
  const productOffset = (currentPage - 1) * productsPerPage;

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
            <h2 className="results-title">
              {searchTerm 
                ? `Showing results for '${searchTerm}'`
                : 'All Products (Live from Sharefox)'
              }
            </h2>
            
            <div className="sharefox-products-container">
              {/* Single scrollable products section - Shows 20 products */}
              {/* Products are arranged in 4 columns (4 products per row) */}
              {/* Scrollable if content exceeds max height */}
              <div 
                key={`products-container-${currentPage}`}
                className="sharefox-products-scrollable"
                style={{
                  width: '100%',
                  overflowY: 'auto',
                  maxHeight: '800px',
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                }}
              >
                <div
                  key={`products-embed-${currentPage}`}
                  data-path="products-popular"
                  data-shop={shopName}
                  data-volume={productsPerPage}
                  className="sharefox-embed"
                  style={{
                    width: '100%',
                    minHeight: '600px',
                  }}
                />
              </div>

              {/* Pagination controls */}
              {/* Note: Pagination is approximate since we don't know exact product count from embed */}
              <div className="pagination-container" style={{
                marginTop: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: currentPage === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 107, 53, 0.2)',
                    color: currentPage === 1 ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                    border: `1.5px solid ${currentPage === 1 ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 107, 53, 0.5)'}`,
                    borderRadius: '8px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
                      e.target.style.borderColor = '#ff6b35';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                      e.target.style.borderColor = 'rgba(255, 107, 53, 0.5)';
                    }
                  }}
                >
                  Previous
                </button>

                {/* Show pages dynamically - only show pages up to max page reached + 1 */}
                {pagesToShow.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      backgroundColor: currentPage === page ? '#ff6b35' : 'rgba(255, 255, 255, 0.05)',
                      color: '#ffffff',
                      border: `1.5px solid ${currentPage === page ? '#ff6b35' : 'rgba(255, 107, 53, 0.3)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: currentPage === page ? 700 : 600,
                      transition: 'all 0.3s ease',
                      minWidth: '44px',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                        e.target.style.borderColor = '#ff6b35';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.target.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(255, 107, 53, 0.2)',
                    color: '#ffffff',
                    border: '1.5px solid rgba(255, 107, 53, 0.5)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.3)';
                    e.target.style.borderColor = '#ff6b35';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 107, 53, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 107, 53, 0.5)';
                  }}
                >
                  Next
                </button>
                
                {/* Show current page info */}
                {currentPage > 1 && (
                  <span style={{
                    marginLeft: '1rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.95rem',
                  }}>
                    Page {currentPage} of {totalPagesToShow}
                  </span>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPageSharefox;

