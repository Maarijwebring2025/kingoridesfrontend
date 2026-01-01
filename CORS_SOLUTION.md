# CORS Issue Resolution Guide

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks requests from one domain to another unless the server explicitly allows it. When your React app (running on `localhost:3000`) tries to call ShareFox API (`api.mysharefox.com`), the browser blocks it due to CORS policy.

## Solutions Implemented

### 1. Development Proxy (✅ Implemented)

I've set up a proxy server that runs during development. This proxy:
- Runs on your development server (`localhost:3000`)
- Forwards API requests to ShareFox
- Adds CORS headers to responses
- Works automatically in development mode

**How it works:**
- In development: Requests go to `/api/sharefox/*` → Proxy forwards to `https://api.mysharefox.com/*`
- In production: Requests go directly to `https://api.mysharefox.com/*`

**Files created:**
- `src/setupProxy.js` - Proxy configuration
- `package.json` - Added `http-proxy-middleware` dependency

### 2. How to Use

1. **Restart your development server:**
   ```bash
   npm start
   ```

2. **The proxy will automatically:**
   - Intercept requests to `/api/sharefox/*`
   - Forward them to ShareFox API
   - Add CORS headers
   - Return responses to your app

3. **Check the console:**
   - You should see "Proxying request to: /products" messages
   - No more CORS errors!

## Production Solutions

### Option 1: Backend Proxy (Recommended)

For production, you'll need a backend server to proxy requests:

**Node.js/Express Example:**
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/api/sharefox', createProxyMiddleware({
  target: 'https://api.mysharefox.com',
  changeOrigin: true,
  pathRewrite: { '^/api/sharefox': '' },
}));

app.listen(3001);
```

**Deploy this backend and update your production API base URL.**

### Option 2: Contact ShareFox Support

Ask ShareFox to:
1. Enable CORS for your domain
2. Add your domain to their allowed origins list
3. Provide the correct API endpoint structure

**Email template:**
```
Subject: CORS Configuration Request for API Access

Hello ShareFox Support,

I'm integrating ShareFox API into my website (your-domain.com) and 
encountering CORS issues when making API requests from the browser.

Could you please:
1. Enable CORS for my domain: your-domain.com
2. Allow the following headers:
   - x-sharefox-shop-domain
   - x-sharefox-admin-domain
   - Authorization
   - Content-Type

My shop domain: kingorides.mysharefox.com

Thank you!
```

### Option 3: Serverless Function (Vercel/Netlify)

If you're deploying to Vercel or Netlify, create a serverless function:

**Vercel: `api/sharefox/[...path].js`**
```javascript
export default async function handler(req, res) {
  const { path } = req.query;
  const targetUrl = `https://api.mysharefox.com/${path.join('/')}`;
  
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      host: 'api.mysharefox.com',
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
  });
  
  const data = await response.json();
  res.json(data);
}
```

## Testing the Proxy

1. **Start the dev server:**
   ```bash
   npm start
   ```

2. **Check browser console:**
   - Look for "Proxying request to: /products"
   - No CORS errors should appear

3. **Check Network tab:**
   - Requests should go to `localhost:3000/api/sharefox/products`
   - Status should be 200 (if API works) or 404 (if endpoint doesn't exist)

## Troubleshooting

### Proxy not working?
1. Make sure `http-proxy-middleware` is installed: `npm list http-proxy-middleware`
2. Restart the dev server completely (stop and start)
3. Check `src/setupProxy.js` exists
4. Clear browser cache

### Still getting CORS errors?
1. Check if you're in development mode: `process.env.NODE_ENV === 'development'`
2. Verify the proxy is intercepting: Check Network tab for `/api/sharefox/*` requests
3. Check ShareFox API might have CORS enabled - test with direct fetch in browser console

### 404 errors instead of CORS?
- This means CORS is working, but the API endpoint doesn't exist
- Contact ShareFox support to enable API access
- Check API documentation: https://api.mysharefox.com/docs

## Current Status

✅ **Development Proxy:** Configured and ready
✅ **CORS Headers:** Added to proxy responses
✅ **Service Updated:** Uses proxy in development, direct API in production

**Next Steps:**
1. Restart your dev server
2. Test the products page
3. If still 404, contact ShareFox support for API access

