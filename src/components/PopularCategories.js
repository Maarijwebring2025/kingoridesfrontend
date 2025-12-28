import React from 'react';
import './PopularCategories.css';
import hatchbackImage from '../assets/hatch back.png';
import sedanImage from '../assets/sedan.png';
import evsImage from '../assets/evs.png';
import suvsImage from '../assets/suvs.png';
import luxuryImage from '../assets/luxury.png';

const PopularCategories = () => {
  const categories = [
    { id: 1, name: 'HATCH BACK', image: hatchbackImage },
    { id: 2, name: 'SEDAN', image: sedanImage },
    { id: 3, name: 'EVS', image: evsImage },
    { id: 4, name: 'SUVS', image: suvsImage },
    { id: 5, name: 'LUXURY', image: luxuryImage },
  ];

  return (
    <section className="popular-categories">
      <div className="popular-categories-container">
        <div className="section-header">
          <h2 className="section-title">POPULAR CATEGORIES</h2>
          <a href="#browse-all" className="browse-all-link">BROWSE ALL</a>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <img src={category.image} alt={category.name} className="category-image" />
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;

