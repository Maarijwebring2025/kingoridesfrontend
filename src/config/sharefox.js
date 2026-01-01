// ShareFox Configuration
// Replace these values with your actual ShareFox credentials

export const SHAREFOX_CONFIG = {
  // Your ShareFox shop domain - must be full domain format (e.g., 'kingorides.mysharefox.com')
  // IMPORTANT: Your shop URL is https://kingorides.mysharefox.com/en
  // The API requires the full domain format, not just the subdomain
  shopDomain: process.env.REACT_APP_SHAREFOX_DOMAIN || 'kingorides.mysharefox.com',
  
  // Full booking base URL (optional - override if you have a custom domain)
  // Using mysharefox.com with /en prefix for English language
  bookingBaseUrl: process.env.REACT_APP_SHAREFOX_BOOKING_URL || 'https://kingorides.mysharefox.com/en',
  
  // Admin credentials for API authentication (keep these secure!)
  // In production, these should be stored in environment variables
  adminEmail: process.env.REACT_APP_SHAREFOX_EMAIL || 'daniyal@kingorides.com',
  adminPassword: process.env.REACT_APP_SHAREFOX_PASSWORD || 'Kingo@123',
  
  // API Base URL
  apiBaseUrl: 'https://api.mysharefox.com',
  
  // Booking widget settings
  bookingWidget: {
    width: 800,
    height: 600,
  },
};

// Product ID mappings (map your car names to ShareFox product IDs)
export const PRODUCT_IDS = {
  'MERCEDES S-CLASS': process.env.REACT_APP_SHAREFOX_MERCEDES_ID || '1010',
  // Add more product mappings as needed
  // 'BMW 5 SERIES': 'product-id-here',
  // 'AUDI A6': 'product-id-here',
};

// Product slug mappings (map product IDs to their ShareFox slugs)
// This is needed because ShareFox uses specific slugs in URLs
// Example: Product 1010 has slug "tesla-y" in ShareFox
export const PRODUCT_SLUGS = {
  '1010': 'tesla-y', // Product ID 1010 -> slug "tesla-y"
  // Add more mappings as needed: 'product-id': 'sharefox-slug',
};

export default SHAREFOX_CONFIG;



