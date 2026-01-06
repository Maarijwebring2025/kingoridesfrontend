import React, { useState, useEffect } from 'react';
import './PopularCategories.css';
import { initShareFox, getCategories } from '../services/sharefox';
import { SHAREFOX_CONFIG } from '../config/sharefox';

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Initialize ShareFox
        initShareFox(SHAREFOX_CONFIG.shopDomain, SHAREFOX_CONFIG.bookingBaseUrl);
        
        // Fetch categories from ShareFox
        const fetchedCategories = await getCategories();
        
        // Map categories (no hardcoded fallbacks)
        const mappedCategories = fetchedCategories.map(category => ({
          id: category.id || category.name,
          name: category.name || category.category_name || 'UNKNOWN',
          image: category.image || category.category_image || category.thumbnail || null,
        }));
        
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="popular-categories">
      <div className="popular-categories-container">
        <div className="section-header">
          <h2 className="section-title">POPULAR CATEGORIES</h2>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Loading categories...
          </div>
        ) : (
          <>
            {categories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                No categories available.
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category.id} className="category-card">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="category-image" />
                    ) : (
                      <div className="category-image" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}>
                        {category.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="category-name">{category.name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PopularCategories;

