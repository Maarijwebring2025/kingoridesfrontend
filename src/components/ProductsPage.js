import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductsPage.css';
import { SHAREFOX_CONFIG } from '../config/sharefox';
import Header from './Header';
import Footer from './Footer';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rentalDays, setRentalDays] = useState('7 Days');
  
  // Filter states
  const [vehicleTypes, setVehicleTypes] = useState({
    compact: false,
    suv: false,
    sedan: false,
    wagon: false,
  });
  
  const [driveLines, setDriveLines] = useState({
    electric: false,
    gasoline: false,
    diesel: false,
    phev: false,
  });
  
  const [priceSort, setPriceSort] = useState(''); // 'low-to-high' or 'high-to-low'

  // Dummy product data with filter properties
  const [allProducts] = useState([
    {
      id: '1010',
      sharefoxId: '1010',
      brand: 'Mercedes',
      model: 'S-Class',
      type: 'sedan',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 250,
    },
    {
      id: '1011',
      sharefoxId: '1010',
      brand: 'Mercedes',
      model: 'S-Class',
      type: 'sedan',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 250,
    },
    {
      id: '1012',
      sharefoxId: '1010',
      brand: 'Mercedes',
      model: 'S-Class',
      type: 'sedan',
      fuel_type: 'diesel',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 250,
    },
    {
      id: '1013',
      sharefoxId: '1010',
      brand: 'Toyota',
      model: 'Camry',
      type: 'sedan',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 200,
    },
    {
      id: '1014',
      sharefoxId: '1010',
      brand: 'BMW',
      model: 'X5',
      type: 'suv',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '3000',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 300,
    },
    {
      id: '1015',
      sharefoxId: '1010',
      brand: 'Audi',
      model: 'A4',
      type: 'sedan',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 280,
    },
    {
      id: '1016',
      sharefoxId: '1010',
      brand: 'Tesla',
      model: 'Model 3',
      type: 'sedan',
      fuel_type: 'electric',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '0',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 350,
    },
    {
      id: '1017',
      sharefoxId: '1010',
      brand: 'Honda',
      model: 'CR-V',
      type: 'suv',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '2000',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 220,
    },
    {
      id: '1018',
      sharefoxId: '1010',
      brand: 'Mercedes',
      model: 'C-Class',
      type: 'sedan',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '2000',
      seats: '4',
      conditioning: true,
      navigation: true,
      price: 240,
    },
    {
      id: '1019',
      sharefoxId: '1010',
      brand: 'Volkswagen',
      model: 'Golf',
      type: 'compact',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '1500',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 180,
    },
    {
      id: '1020',
      sharefoxId: '1010',
      brand: 'Toyota',
      model: 'Prius',
      type: 'sedan',
      fuel_type: 'phev',
      available: true,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      engine: '1800',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 190,
    },
    {
      id: '1021',
      sharefoxId: '1010',
      brand: 'Subaru',
      model: 'Outback',
      type: 'wagon',
      fuel_type: 'gasoline',
      available: true,
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      engine: '2500',
      seats: '5',
      conditioning: true,
      navigation: true,
      price: 260,
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const brand = (product.brand || '').toLowerCase();
        const model = (product.model || '').toLowerCase();
        return brand.includes(searchLower) || model.includes(searchLower);
      });
    }

    // Apply vehicle type filters
    const activeVehicleTypes = Object.entries(vehicleTypes)
      .filter(([_, checked]) => checked)
      .map(([type, _]) => type);
    
    if (activeVehicleTypes.length > 0) {
      filtered = filtered.filter(product => {
        const productType = (product.type || '').toLowerCase();
        return activeVehicleTypes.some(type => productType === type);
      });
    }

    // Apply drive line filters
    const activeDriveLines = Object.entries(driveLines)
      .filter(([_, checked]) => checked)
      .map(([line, _]) => line);
    
    if (activeDriveLines.length > 0) {
      filtered = filtered.filter(product => {
        const productFuel = (product.fuel_type || '').toLowerCase();
        return activeDriveLines.some(line => productFuel === line);
      });
    }

    // Apply price sorting
    if (priceSort === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, vehicleTypes, driveLines, priceSort]);

  const handleVehicleTypeChange = (type) => {
    setVehicleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleDriveLineChange = (line) => {
    setDriveLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  const handlePriceSortChange = (sort) => {
    setPriceSort(prev => prev === sort ? '' : sort);
  };

  const handleSearch = () => {
    // Search is handled by the useEffect filter
  };

  const handleProductClick = (product) => {
    const productId = product.id;
    navigate(`/products/custom/${productId}`, { state: { product } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
          {/* Left Sidebar - Filters */}
          <aside className="products-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Vehicle type</h3>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={vehicleTypes.compact}
                    onChange={() => handleVehicleTypeChange('compact')}
                  />
                  <span className="checkmark"></span>
                  Compact
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={vehicleTypes.suv}
                    onChange={() => handleVehicleTypeChange('suv')}
                  />
                  <span className="checkmark"></span>
                  SUV
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={vehicleTypes.sedan}
                    onChange={() => handleVehicleTypeChange('sedan')}
                  />
                  <span className="checkmark"></span>
                  Sedan
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={vehicleTypes.wagon}
                    onChange={() => handleVehicleTypeChange('wagon')}
                  />
                  <span className="checkmark"></span>
                  Wagon
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Drive Line</h3>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={driveLines.electric}
                    onChange={() => handleDriveLineChange('electric')}
                  />
                  <span className="checkmark"></span>
                  Electric
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={driveLines.gasoline}
                    onChange={() => handleDriveLineChange('gasoline')}
                  />
                  <span className="checkmark"></span>
                  Gasoline
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={driveLines.diesel}
                    onChange={() => handleDriveLineChange('diesel')}
                  />
                  <span className="checkmark"></span>
                  Diesel
                </label>
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={driveLines.phev}
                    onChange={() => handleDriveLineChange('phev')}
                  />
                  <span className="checkmark"></span>
                  PHEV
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Price</h3>
              <div className="filter-options">
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="price-sort"
                    checked={priceSort === 'low-to-high'}
                    onChange={() => handlePriceSortChange('low-to-high')}
                  />
                  <span className="radio-mark"></span>
                  Low to High
                </label>
                <label className="filter-radio">
                  <input
                    type="radio"
                    name="price-sort"
                    checked={priceSort === 'high-to-low'}
                    onChange={() => handlePriceSortChange('high-to-low')}
                  />
                  <span className="radio-mark"></span>
                  High to Low
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="products-main-content">
            <h2 className="results-title">
              {searchTerm 
                ? `Showing results for '${searchTerm}'`
                : 'All Products'
              }
            </h2>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products found{searchTerm && ` matching "${searchTerm}"`}.</p>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-card-header">
                      <div className="product-brand-model">
                        <span className="product-brand">{product.brand}</span>
                        <span className="product-model">{product.model}</span>
                      </div>
                      {product.available && (
                        <div className="product-availability">
                          <span className="availability-dot"></span>
                          <span>Available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={`${product.brand} ${product.model}`}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250?text=Car+Image';
                        }}
                      />
                    </div>
                    
                    <div className="product-specs">
                      <div className="spec-item">
                        <span className="spec-icon">⚙️</span>
                        <span>{product.engine} CC</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">🪑</span>
                        <span>{product.seats} Seats</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">❄️</span>
                        <span>Conditioning</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">🧭</span>
                        <span>Navigation</span>
                      </div>
                    </div>
                    
                    <div className="product-price-section">
                      <span className="price-label">Starting</span>
                      <span className="price-value">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
