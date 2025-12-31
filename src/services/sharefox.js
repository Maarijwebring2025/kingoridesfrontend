// ShareFox API Service
// Documentation: https://api.mysharefox.com/docs

const SHAREFOX_API_BASE = 'https://api.mysharefox.com';
let authToken = null;
let shopDomain = null;
let bookingBaseUrl = null;

/**
 * Initialize ShareFox with shop domain
 * @param {string} domain - Your ShareFox shop admin domain
 * @param {string} customBookingUrl - Optional custom booking base URL
 */
export const initShareFox = (domain, customBookingUrl = null) => {
  shopDomain = domain;
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
          'Authorization': `Bearer ${authToken}`,
          'x-sharefox-admin-domain': shopDomain || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch available products');
    }

    const data = await response.json();
    return data.products || data || [];
  } catch (error) {
    console.error('ShareFox get products error:', error);
    throw error;
  }
};

/**
 * Create a booking/order
 * @param {Object} bookingData - Booking details
 * @param {string} bookingData.productId - Product ID
 * @param {string} bookingData.startDate - Start date (YYYY-MM-DD)
 * @param {string} bookingData.endDate - End date (YYYY-MM-DD)
 * @param {Object} bookingData.customer - Customer information
 * @returns {Promise<Object>} - Booking confirmation
 */
export const createBooking = async (bookingData) => {
  try {
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
  getAvailableProducts,
  createBooking,
  openShareFoxBooking,
  getBookingUrl,
};



