const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy ShareFox Main API requests to avoid CORS issues
  app.use(
    '/api/sharefox',
    createProxyMiddleware({
      target: 'https://api.mysharefox.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api/sharefox': '', // Remove /api/sharefox prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        // Forward all headers from the original request
        console.log('Proxying ShareFox API request to:', proxyReq.path);
        // Ensure shop domain headers are forwarded
        if (req.headers['x-sharefox-shop-domain']) {
          proxyReq.setHeader('x-sharefox-shop-domain', req.headers['x-sharefox-shop-domain']);
        }
        if (req.headers['x-sharefox-admin-domain']) {
          proxyReq.setHeader('x-sharefox-admin-domain', req.headers['x-sharefox-admin-domain']);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-sharefox-shop-domain, x-sharefox-admin-domain, Accept';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error', message: err.message });
      },
      logLevel: 'debug',
    })
  );

  // Proxy ShareFox Shop API requests (for shop-specific endpoints)
  app.use(
    '/api/sharefox-shop',
    createProxyMiddleware({
      target: 'https://kingorides.mysharefox.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api/sharefox-shop': '', // Remove /api/sharefox-shop prefix
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying ShareFox Shop API request to:', proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add CORS headers to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-sharefox-shop-domain, x-sharefox-admin-domain, Accept';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      },
      onError: (err, req, res) => {
        console.error('Shop proxy error:', err);
        res.status(500).json({ error: 'Shop proxy error', message: err.message });
      },
      logLevel: 'debug',
    })
  );
};

