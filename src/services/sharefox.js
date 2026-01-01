// ShareFox API Service
// Documentation: https://api.mysharefox.com/docs

// Use proxy in development to avoid CORS issues, direct API in production
const SHAREFOX_API_BASE = process.env.NODE_ENV === 'development' 
  ? '/api/sharefox'  // Use proxy in development
  : 'https://api.mysharefox.com';  // Direct API in production
let authToken = null;
let shopDomain = null;
let bookingBaseUrl = null;

/**
 * Normalize shop domain to full domain format required by ShareFox API
 * Converts 'kingorides' to 'kingorides.mysharefox.com'
 * @param {string} domain - Shop domain (can be subdomain or full domain)
 * @returns {string} - Full domain format
 */
const normalizeShopDomain = (domain) => {
  if (!domain) return '';
  // If already a full domain (contains dots), return as is
  if (domain.includes('.')) {
    return domain;
  }
  // Otherwise, append .mysharefox.com
  return `${domain}.mysharefox.com`;
};

/**
 * Initialize ShareFox with shop domain
 * @param {string} domain - Your ShareFox shop domain (can be subdomain or full domain)
 * @param {string} customBookingUrl - Optional custom booking base URL
 */
export const initShareFox = (domain, customBookingUrl = null) => {
  // Normalize domain to full format (e.g., 'kingorides' -> 'kingorides.mysharefox.com')
  shopDomain = normalizeShopDomain(domain);
  bookingBaseUrl = customBookingUrl || process.env.REACT_APP_SHAREFOX_BOOKING_URL || null;
  // Token will be obtained when needed via login
};

/**
 * Authenticate with ShareFox API
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<string>} - Authentication token
 */
export const authenticateShareFox = async (email, password) => {
  try {
    const response = await fetch(`${SHAREFOX_API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sharefox-admin-domain': shopDomain || '',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    authToken = data.token || data.access_token;
    return authToken;
  } catch (error) {
    console.error('ShareFox authentication error:', error);
    throw error;
  }
};

/**
 * Set authentication token directly (if you have it)
 * @param {string} token - Authentication token
 */
export const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Get all products
 * Note: This endpoint might require authentication
 * @param {boolean} useAuth - Whether to authenticate first (default: false)
 * @returns {Promise<Array>} - Array of all products
 */
export const getProducts = async (useAuth = false) => {
  try {
    // ShareFox API structure might be different - try shop's own API endpoint first
    // Since the shop URL works (kingorides.mysharefox.com/en/products/...), 
    // the shop might have its own API endpoint
    const shopBaseUrl = bookingBaseUrl || `https://${shopDomain}`;
    
    // Try shop's API endpoint first: https://kingorides.mysharefox.com/api/products
    // In development, use proxy to avoid CORS issues
    let url;
    if (process.env.NODE_ENV === 'development') {
      // Use proxy for shop API in development to avoid CORS
      url = `/api/sharefox/products`;
    } else {
      url = `${shopBaseUrl}/api/products`;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add shop domain header - API requires full domain format
    if (shopDomain) {
      headers['x-sharefox-shop-domain'] = shopDomain;
      headers['x-sharefox-admin-domain'] = shopDomain;
    }
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('Fetching products from shop API:', url);
    console.log('Headers:', headers);
    console.log('Shop domain:', shopDomain);
    console.log('Using auth:', !!authToken);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      // If 404, try alternative endpoints
      if (response.status === 404) {
        console.log('Shop API returned 404, trying main API endpoint...');
        
        // Try 1: Main API endpoint
        const altUrl1 = `${SHAREFOX_API_BASE}/products`;
        console.log('Trying main API URL:', altUrl1);
        
        const altResponse1 = await fetch(altUrl1, {
          method: 'GET',
          headers: headers,
        });
        
        if (altResponse1.ok) {
          const altData = await altResponse1.json();
          console.log('Products data received from main API:', altData);
          return Array.isArray(altData) ? altData : (altData.products || altData.data || []);
        }
        
        // Try 2: Main API with shop domain in path
        if (altResponse1.status === 404) {
          console.log('Main API also 404, trying shop domain in path...');
          const altUrl2 = `${SHAREFOX_API_BASE}/shops/${shopDomain}/products`;
          console.log('Trying alternative URL:', altUrl2);
          
          const altResponse2 = await fetch(altUrl2, {
            method: 'GET',
            headers: headers,
          });
          
          if (altResponse2.ok) {
            const altData = await altResponse2.json();
            console.log('Products data received from shop path endpoint:', altData);
            return Array.isArray(altData) ? altData : (altData.products || altData.data || []);
          }
        }
        
        // All endpoints failed - the API might not be available
        throw new Error(`Products API endpoint not found (404). The ShareFox API products endpoint may not be available for your shop, or it might require a different authentication method. Please check the ShareFox API documentation at https://api.mysharefox.com/docs or contact ShareFox support to enable API access for your shop.`);
      }
      
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      let errorMessage = `Failed to fetch products (${response.status})`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If it's HTML (like the error page), provide a helpful message
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `ShareFox API returned an error page. The products endpoint might require authentication or may not be available for your shop. Please check your ShareFox API documentation or contact ShareFox support.`;
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Products data received:', data);
    return Array.isArray(data) ? data : (data.products || data.data || []);
  } catch (error) {
    console.error('ShareFox get products error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Check if it's a CORS error
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('CORS Error: ShareFox API may not allow direct browser requests. You may need a backend proxy or CORS configuration on ShareFox side.');
    }
    
    throw error;
  }
};

/**
 * Get a single product by ID (public endpoint - no auth required)
 * @param {string|number} productId - Product ID
 * @returns {Promise<Object>} - Product details
 */
export const getProductById = async (productId) => {
  try {
    const url = `${SHAREFOX_API_BASE}/products/${productId}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add shop domain header if available
    // API requires full domain format (e.g., 'kingorides.mysharefox.com')
    if (shopDomain) {
      headers['x-sharefox-shop-domain'] = shopDomain;
      headers['x-sharefox-admin-domain'] = shopDomain;
    }

    console.log('Fetching product from:', url);
    console.log('Headers:', headers);

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      let errorMessage = `Failed to fetch product (${response.status})`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ShareFox get product by ID error:', error);
    throw error;
  }
};

/**
 * Get available products (cars) for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} - Array of available products
 */
export const getAvailableProducts = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${SHAREFOX_API_BASE}/products?available_from=${startDate}&available_to=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-sharefox-admin-domain': shopDomain || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch available products');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.products || data.data || []);
  } catch (error) {
    console.error('ShareFox get available products error:', error);
    throw error;
  }
};

/**
 * Login as shop user (customer) to create orders
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 * @returns {Promise<string>} - JWT token for shop user
 */
export const loginShopUser = async (email, password) => {
  try {
    const response = await fetch(`${SHAREFOX_API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sharefox-admin-domain': shopDomain || '',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data.token || data.access_token;
  } catch (error) {
    console.error('ShareFox shop user login error:', error);
    throw error;
  }
};

/**
 * Register a new shop user (customer)
 * @param {Object} userData - User registration data
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @param {string} userData.name - Full name
 * @param {string} userData.phone - Phone number (optional)
 * @returns {Promise<Object>} - Registration response
 */
export const registerShopUser = async (userData) => {
  try {
    const response = await fetch(`${SHAREFOX_API_BASE}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sharefox-admin-domain': shopDomain || '',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ShareFox registration error:', error);
    throw error;
  }
};

/**
 * Add product to cart (requires shop user authentication)
 * @param {string} userToken - Shop user JWT token
 * @param {string} productId - Product ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} - Cart item
 */
export const addToCart = async (userToken, productId, startDate, endDate) => {
  try {
    const response = await fetch(`${SHAREFOX_API_BASE}/orders/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'x-sharefox-admin-domain': shopDomain || '',
      },
      body: JSON.stringify({
        product_id: productId,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ShareFox add to cart error:', error);
    throw error;
  }
};

/**
 * Create a booking/order (admin endpoint - requires admin auth)
 * @param {Object} bookingData - Booking details
 * @param {string} bookingData.productId - Product ID
 * @param {string} bookingData.startDate - Start date (YYYY-MM-DD)
 * @param {string} bookingData.endDate - End date (YYYY-MM-DD)
 * @param {Object} bookingData.customer - Customer information
 * @returns {Promise<Object>} - Booking confirmation
 */
export const createBooking = async (bookingData) => {
  try {
    // Ensure we have auth token
    if (!authToken) {
      throw new Error('Authentication required. Please authenticate first.');
    }

    const response = await fetch(`${SHAREFOX_API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-sharefox-admin-domain': shopDomain || '',
      },
      body: JSON.stringify({
        product_id: bookingData.productId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        customer: bookingData.customer,
        ...bookingData.additionalData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ShareFox create booking error:', error);
    throw error;
  }
};

/**
 * Open ShareFox booking widget/modal
 * @param {Object} options - Booking options
 * @param {string} options.productId - Product ID
 * @param {string} options.startDate - Start date
 * @param {string} options.endDate - End date
 * @param {string} options.productSlug - Product slug (optional)
 * @param {string} options.productName - Product name (optional, used to generate slug)
 */
export const openShareFoxBooking = (options) => {
  const { productId, startDate, endDate, productSlug, productName, slugMap } = options;
  
  // Get booking URL with proper format: /en/products/{productId}/{product-slug}
  const bookingUrl = getBookingUrl(productId, startDate, endDate, productSlug, productName, slugMap);
  
  // Open in new window or redirect
  window.open(bookingUrl, '_blank', 'width=800,height=600');
};

/**
 * Generate product slug from product name
 * Converts "MERCEDES S-CLASS" to "mercedes-s-class"
 * @param {string} productName - Product name
 * @returns {string} - URL-friendly slug
 */
const generateProductSlug = (productName) => {
  if (!productName) return '';
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Get product slug - checks mapping first, then generates from name
 * @param {string} productId - Product ID
 * @param {string} productName - Product name
 * @param {Object} slugMap - Optional slug mapping object
 * @returns {string} - Product slug
 */
const getProductSlug = (productId, productName, slugMap = null) => {
  // Check if there's a slug mapping for this product ID
  if (slugMap && slugMap[productId]) {
    return slugMap[productId];
  }
  // Generate from product name
  return generateProductSlug(productName);
};

/**
 * Get booking URL for a product
 * ShareFox uses format: /en/products/{productId}/{product-slug}
 * @param {string} productId - Product ID
 * @param {string} startDate - Start date (optional, for query params)
 * @param {string} endDate - End date (optional, for query params)
 * @param {string} productSlug - Product slug (optional, will be generated from productName if not provided)
 * @param {string} productName - Product name (optional, used to generate slug)
 * @returns {string} - Booking URL
 */
export const getBookingUrl = (productId, startDate = null, endDate = null, productSlug = null, productName = null, slugMap = null) => {
  // Determine the product slug
  let slug = productSlug;
  if (!slug) {
    slug = getProductSlug(productId, productName, slugMap);
  }
  // If no slug available, use the product ID as fallback
  slug = slug || productId;
  
  // Get base URL
  const customUrl = bookingBaseUrl || process.env.REACT_APP_SHAREFOX_BOOKING_URL || '';
  const baseUrl = customUrl || `https://${shopDomain || 'kingorides'}.mysharefox.com/en`;
  
  // Build the product page URL: /en/products/{productId}/{product-slug}
  let bookingUrl = `${baseUrl.replace(/\/$/, '')}/products/${productId}/${slug}`;
  
  // Add query parameters if dates are provided
  if (startDate && endDate) {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
    });
    bookingUrl += `?${params.toString()}`;
  }
  
  return bookingUrl;
};

export default {
  initShareFox,
  authenticateShareFox,
  setAuthToken,
  getProducts,
  getProductById,
  getAvailableProducts,
  loginShopUser,
  registerShopUser,
  addToCart,
  createBooking,
  openShareFoxBooking,
  getBookingUrl,
};



