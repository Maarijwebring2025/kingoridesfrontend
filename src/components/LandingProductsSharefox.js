import React, { useEffect, useState } from 'react';
import { SHAREFOX_CONFIG } from '../config/sharefox';

const LandingProductsSharefox = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const productsToShow = 8; // compact list for landing

  // Get shop name from domain (e.g., 'kingorides.mysharefox.com' -> 'kingorides')
  const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');

  // Load Sharefox Embed script
  useEffect(() => {
    setScriptLoaded(true);

    const existingScript = document.getElementById('sharefox-embed-script');
    if (existingScript) {
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
        if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
          window.SharefoxEmbed.init();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'sharefox-embed-script';
    script.setAttribute('data-shop', shopName);
    script.src = `https://${shopName}.mysharefox.com/embed.min.js`;
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
        if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
          window.SharefoxEmbed.init();
        }
      }, 600);
    };

    script.onerror = () => {
      console.error('Failed to load Sharefox Embed script');
    };

    document.head.appendChild(script);
  }, [shopName]);

  // Re-initialize embeds when component updates
  useEffect(() => {
    if (!scriptLoaded) return;
    const initializeEmbeds = () => {
      window.dispatchEvent(new Event('DOMContentLoaded'));
      if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
        window.SharefoxEmbed.init();
      }
    };
    const t1 = setTimeout(initializeEmbeds, 200);
    const t2 = setTimeout(initializeEmbeds, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [scriptLoaded]);

  return (
    <section className="products-section" style={{ padding: '3rem 0' }}>
      <div className="products-page-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
        <div className="section-header">
          <h2 className="section-title">POPULAR PRODUCTS</h2>
        </div>
        <div
          className="sharefox-embed"
          data-path="products-popular"
          data-shop={shopName}
          data-volume={productsToShow}
          style={{
            width: '100%',
            minHeight: '480px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        />
      </div>
    </section>
  );
};

export default LandingProductsSharefox;

