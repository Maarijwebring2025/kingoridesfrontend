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
    const shopBaseUrl = bookingBaseUrl || `https://${shopDomain}`;
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

    // List of endpoints to try in order
    const endpointsToTry = [
      // Shop-specific API endpoints (using shop proxy)
      {
        name: 'Shop API /api/products',
        url: process.env.NODE_ENV === 'development' 
          ? '/api/sharefox-shop/api/products'
          : `${shopBaseUrl}/api/products`,
        useShopProxy: true,
      },
      {
        name: 'Shop API /en/api/products',
        url: process.env.NODE_ENV === 'development'
          ? '/api/sharefox-shop/en/api/products'
          : `${shopBaseUrl}/en/api/products`,
        useShopProxy: true,
      },
      {
        name: 'Shop API /api/v1/products',
        url: process.env.NODE_ENV === 'development'
          ? '/api/sharefox-shop/api/v1/products'
          : `${shopBaseUrl}/api/v1/products`,
        useShopProxy: true,
      },
      // Main API endpoints (using main proxy)
      {
        name: 'Main API /products',
        url: `${SHAREFOX_API_BASE}/products`,
        useShopProxy: false,
      },
      {
        name: 'Main API /shops/{domain}/products',
        url: `${SHAREFOX_API_BASE}/shops/${shopDomain}/products`,
        useShopProxy: false,
      },
    ];

    // Try each endpoint
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Trying ${endpoint.name}:`, endpoint.url);
        
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: headers,
        });

        console.log(`Response status for ${endpoint.name}:`, response.status);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log(`Products data received from ${endpoint.name}:`, data);
            
            // Handle different response formats
            if (Array.isArray(data)) {
              return data;
            } else if (data.products && Array.isArray(data.products)) {
              return data.products;
            } else if (data.data && Array.isArray(data.data)) {
              return data.data;
            } else if (data.items && Array.isArray(data.items)) {
              return data.items;
            } else {
              // If it's an object with product-like structure, wrap it in array
              console.warn('Unexpected response format, attempting to extract products');
              return [data];
            }
          } else {
            // If response is not JSON, log and try next endpoint
            const text = await response.text();
            console.log(`Non-JSON response from ${endpoint.name}:`, text.substring(0, 200));
            continue;
          }
        } else if (response.status !== 404) {
          // If it's not a 404, log the error but continue trying
          const errorText = await response.text();
          console.warn(`Error ${response.status} from ${endpoint.name}:`, errorText.substring(0, 200));
        }
      } catch (err) {
        console.warn(`Error trying ${endpoint.name}:`, err.message);
        // Continue to next endpoint
        continue;
      }
    }

    // All endpoints failed - try to extract products from shop's products page as last resort
    console.log('All API endpoints failed, trying to fetch from shop products page...');
    try {
      const shopProductsUrl = process.env.NODE_ENV === 'development'
        ? '/api/sharefox-shop/en/products'
        : `${shopBaseUrl}/en/products`;
      
      const pageResponse = await fetch(shopProductsUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        
        // Try to find JSON data embedded in the page (common pattern: window.__INITIAL_STATE__ or data-products)
        const jsonMatches = [
          html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});/),
          html.match(/data-products=["']([^"']+)["']/),
          html.match(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi),
          html.match(/var\s+products\s*=\s*(\[[\s\S]*?\]);/),
        ];

        for (const match of jsonMatches) {
          if (match && match[1]) {
            try {
              const data = JSON.parse(match[1]);
              if (Array.isArray(data)) {
                console.log('Found products in page HTML:', data.length);
                return data;
              } else if (data.products && Array.isArray(data.products)) {
                console.log('Found products in page HTML:', data.products.length);
                return data.products;
              }
            } catch (e) {
              // Continue trying other matches
              continue;
            }
          }
        }
        
        console.log('Could not extract product data from page HTML');
      }
    } catch (htmlError) {
      console.warn('Failed to fetch products from shop page:', htmlError.message);
    }

    // All methods failed
    throw new Error(`Unable to fetch products from ShareFox. All API endpoints returned errors. The ShareFox API products endpoint may not be available for your shop. Please contact ShareFox support to enable API access for your shop. You can also check the ShareFox API documentation at https://api.mysharefox.com/docs`);
    
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
 * Search products by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of matching products
 */
export const searchProducts = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return await getProducts();
    }

    const shopBaseUrl = bookingBaseUrl || `https://${shopDomain}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add shop domain header
    if (shopDomain) {
      headers['x-sharefox-shop-domain'] = shopDomain;
      headers['x-sharefox-admin-domain'] = shopDomain;
    }
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // List of search endpoints to try
    const endpointsToTry = [
      {
        name: 'Shop API /api/products?search=',
        url: process.env.NODE_ENV === 'development' 
          ? `/api/sharefox-shop/api/products?search=${encodeURIComponent(query)}`
          : `${shopBaseUrl}/api/products?search=${encodeURIComponent(query)}`,
      },
      {
        name: 'Shop API /en/api/products?search=',
        url: process.env.NODE_ENV === 'development'
          ? `/api/sharefox-shop/en/api/products?search=${encodeURIComponent(query)}`
          : `${shopBaseUrl}/en/api/products?search=${encodeURIComponent(query)}`,
      },
      {
        name: 'Main API /products?search=',
        url: `${SHAREFOX_API_BASE}/products?search=${encodeURIComponent(query)}`,
      },
    ];

    // Try each endpoint
    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: headers,
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            // Handle different response formats
            if (Array.isArray(data)) {
              return data;
            } else if (data.products && Array.isArray(data.products)) {
              return data.products;
            } else if (data.data && Array.isArray(data.data)) {
              return data.data;
            } else if (data.items && Array.isArray(data.items)) {
              return data.items;
            }
          }
        }
      } catch (err) {
        console.warn(`Error trying ${endpoint.name}:`, err.message);
        continue;
      }
    }

    // If search endpoint doesn't work, fetch all products and filter client-side
    console.log('Search endpoint not available, filtering products client-side...');
    const allProducts = await getProducts();
    console.log(`Total products fetched: ${allProducts.length}`);
    
    // Normalize search query - trim, lowercase, and remove duplicate words
    const searchLower = query.trim().toLowerCase();
    // Remove duplicate words from search query (e.g., "tesla tesla" becomes "tesla")
    const uniqueWords = [...new Set(searchLower.split(/\s+/).filter(word => word.length > 0))];
    const searchWords = uniqueWords;
    const normalizedQuery = uniqueWords.join(' ');
    console.log(`Search query: "${query}" -> normalized: "${normalizedQuery}", Search words:`, searchWords);
    
    // Filter products by search query (case-insensitive, multi-word matching)
    const filteredProducts = allProducts.filter(product => {
      // Extract all possible searchable text fields from product (check multiple field name variations)
      const name = (product.name || product.title || product.product_name || product.label || product.display_name || '').toLowerCase();
      const brand = (product.brand || product.manufacturer || product.make || product.company || '').toLowerCase();
      const description = (product.description || product.details || product.desc || product.summary || product.info || '').toLowerCase();
      const category = (product.category || product.type || product.vehicle_type || product.category_name || product.vehicleCategory || '').toLowerCase();
      const model = (product.model || product.model_name || product.modelName || '').toLowerCase();
      const year = (product.year || product.year_model || product.yearModel || '').toString().toLowerCase();
      const slug = (product.slug || product.product_slug || product.url_slug || '').toLowerCase();
      
      // Also check nested fields that might contain the search term
      const variantName = (product.variant?.name || product.variant?.title || '').toLowerCase();
      const variantModel = (product.variant?.model || '').toLowerCase();
      
      // Combine all searchable fields into one searchable text string
      const searchableText = `${name} ${brand} ${description} ${category} ${model} ${year} ${slug} ${variantName} ${variantModel}`.toLowerCase();
      
      // Check if all search words are found in the searchable text
      // This allows for multi-word searches like "mercedes sedan" to match products
      const allWordsMatch = searchWords.every(word => searchableText.includes(word));
      
      // Also check for exact phrase match (use normalized query)
      const exactMatch = searchableText.includes(normalizedQuery) || searchableText.includes(searchLower);
      
      // Check individual word matches in key fields
      const individualWordMatch = searchWords.some(word => 
        name.includes(word) || 
        brand.includes(word) || 
        model.includes(word) ||
        category.includes(word) ||
        slug.includes(word) ||
        variantName.includes(word) ||
        variantModel.includes(word)
      );
      
      // If still no match, do a comprehensive check by converting entire product to string
      // This catches any field we might have missed
      let comprehensiveMatch = false;
      if (!allWordsMatch && !exactMatch && !individualWordMatch) {
        try {
          const productString = JSON.stringify(product).toLowerCase();
          // Check both normalized query and original search term
          comprehensiveMatch = productString.includes(normalizedQuery) || productString.includes(searchLower);
        } catch (e) {
          // If JSON.stringify fails, skip comprehensive check
        }
      }
      
      // Return true if any match condition is met
      const matches = allWordsMatch || exactMatch || individualWordMatch || comprehensiveMatch;
      
      // Debug logging for tesla searches
      if (searchLower.includes('tesla') && matches) {
        console.log('Tesla product matched:', {
          id: product.id || product.product_id,
          name: product.name || product.title,
          brand: product.brand,
          searchableText: searchableText.substring(0, 200),
          matchType: allWordsMatch ? 'allWords' : exactMatch ? 'exact' : individualWordMatch ? 'individual' : 'comprehensive'
        });
      }
      
      return matches;
    });
    
    console.log(`Filtered products: ${filteredProducts.length} out of ${allProducts.length}`);
    return filteredProducts;
  } catch (error) {
    console.error('ShareFox search products error:', error);
    // Return empty array on error
    return [];
  }
};

/**
 * Get categories from ShareFox
 * Tries to fetch from categories endpoint, or extracts unique categories from products
 * @returns {Promise<Array>} - Array of categories
 */
export const getCategories = async () => {
  try {
    const shopBaseUrl = bookingBaseUrl || `https://${shopDomain}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add shop domain header
    if (shopDomain) {
      headers['x-sharefox-shop-domain'] = shopDomain;
      headers['x-sharefox-admin-domain'] = shopDomain;
    }
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // List of category endpoints to try
    const endpointsToTry = [
      {
        name: 'Shop API /api/categories',
        url: process.env.NODE_ENV === 'development' 
          ? '/api/sharefox-shop/api/categories'
          : `${shopBaseUrl}/api/categories`,
      },
      {
        name: 'Shop API /en/api/categories',
        url: process.env.NODE_ENV === 'development'
          ? '/api/sharefox-shop/en/api/categories'
          : `${shopBaseUrl}/en/api/categories`,
      },
      {
        name: 'Main API /categories',
        url: `${SHAREFOX_API_BASE}/categories`,
      },
      {
        name: 'Main API /shops/{domain}/categories',
        url: `${SHAREFOX_API_BASE}/shops/${shopDomain}/categories`,
      },
    ];

    // Try each endpoint
    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Trying ${endpoint.name}:`, endpoint.url);
        
        const response = await fetch(endpoint.url, {
          method: 'GET',
          headers: headers,
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log(`Categories data received from ${endpoint.name}:`, data);
            
            // Handle different response formats
            if (Array.isArray(data)) {
              return data;
            } else if (data.categories && Array.isArray(data.categories)) {
              return data.categories;
            } else if (data.data && Array.isArray(data.data)) {
              return data.data;
            } else if (data.items && Array.isArray(data.items)) {
              return data.items;
            }
          }
        }
      } catch (err) {
        console.warn(`Error trying ${endpoint.name}:`, err.message);
        continue;
      }
    }

    // If categories endpoint doesn't work, extract categories from products
    console.log('Categories endpoint not available, extracting from products...');
    const products = await getProducts();
    
    // Extract unique categories from products
    const categoryMap = new Map();
    
    products.forEach(product => {
      // Try different possible category fields
      const categoryName = product.category || product.type || product.vehicle_type || product.category_name;
      const categoryId = product.category_id || product.type_id;
      const categoryImage = product.category_image || product.image || product.thumbnail;
      
      if (categoryName) {
        const key = categoryId || categoryName.toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, {
            id: categoryId || key,
            name: categoryName.toUpperCase(),
            image: categoryImage || null,
          });
        }
      }
    });
    
    const categories = Array.from(categoryMap.values());
    
    // If no categories found, return empty array
    if (categories.length === 0) {
      console.warn('No categories found in products');
      return [];
    }
    
    return categories;
  } catch (error) {
    console.error('ShareFox get categories error:', error);
    // Return empty array on error instead of throwing
    return [];
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
  
  // Open in same tab
  window.location.href = bookingUrl;
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
  searchProducts,
  getCategories,
  loginShopUser,
  registerShopUser,
  addToCart,
  createBooking,
  openShareFoxBooking,
  getBookingUrl,
};



