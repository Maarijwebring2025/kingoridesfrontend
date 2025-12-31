# ShareFox Booking URL Troubleshooting

If you're getting "not accessible" errors with the ShareFox booking URL, follow these steps to find the correct URL format.

## Finding Your ShareFox Shop URL

### Step 1: Log in to ShareFox Admin Panel

1. Go to your ShareFox admin login page (usually `https://[your-domain].sharefox.eu/admin` or `https://[your-domain].mysharefox.com/admin`)
2. Log in with your credentials: `daniyal@kingorides.com`

### Step 2: Find Your Shop URL

Once logged in, look for:
- **Shop Settings** or **Store Settings**
- **Storefront URL** or **Customer Portal URL**
- Your shop's public URL (this is what customers use to book)

Common ShareFox URL formats:
- `https://kingorides.sharefox.eu`
- `https://kingorides.mysharefox.com`
- Custom domain (e.g., `https://book.kingorides.com`)

### Step 3: Test the Booking URL Manually

1. Find a product in your ShareFox admin panel
2. Look for a "View" or "Preview" link next to product ID 1010
3. This will show you the correct booking URL format
4. Copy that URL format

## Common URL Formats

ShareFox booking URLs can use different formats. Try these:

### Format 1: Standard ShareFox URL
```
https://kingorides.sharefox.eu/book?product=1010&start=2026-01-01&end=2026-01-01
```

### Format 2: Alternative Domain
```
https://kingorides.mysharefox.com/book?product=1010&start=2026-01-01&end=2026-01-01
```

### Format 3: Different Path
```
https://kingorides.sharefox.eu/booking?product=1010&start=2026-01-01&end=2026-01-01
```

### Format 4: Product-Specific Path
```
https://kingorides.sharefox.eu/products/1010/book?start=2026-01-01&end=2026-01-01
```

## Updating the Configuration

Once you find the correct URL format, update your configuration:

### Option 1: Update Shop Domain (if using standard format)

Edit `.env` file:
```env
REACT_APP_SHAREFOX_DOMAIN=your-actual-shop-domain
```

### Option 2: Use Custom Booking URL (if using custom domain or different format)

Edit `.env` file:
```env
REACT_APP_SHAREFOX_BOOKING_URL=https://your-actual-shop-url.sharefox.eu
```

Or if you have a custom domain:
```env
REACT_APP_SHAREFOX_BOOKING_URL=https://book.kingorides.com
```

Then update `src/services/sharefox.js` if needed to adjust the path structure.

## Quick Test

1. Log in to ShareFox admin: `https://kingorides.sharefox.eu/admin` (or your actual admin URL)
2. Navigate to Products
3. Find product ID 1010
4. Click "View" or "Preview" to see the public product page
5. Try to start a booking - note the URL structure
6. Use that URL format in your configuration

## Still Having Issues?

1. **Check Product Status**: Ensure product ID 1010 is active and published
2. **Check Availability**: Verify the product is available for booking on the selected dates
3. **Contact ShareFox Support**: If the URL format is still unclear, contact ShareFox support with:
   - Your shop domain
   - Product ID: 1010
   - The URL format you're trying to use

## Alternative: Using ShareFox Embed/Widget

If direct URL booking doesn't work, consider using ShareFox's embed/widget feature:

1. In ShareFox admin, look for "Embed" or "Widget" options
2. ShareFox may provide an iframe code or JavaScript snippet
3. We can integrate that into the booking component instead

Let me know the correct URL format once you find it, and I'll update the code accordingly!

