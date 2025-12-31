# ShareFox Integration Guide

This guide will help you set up ShareFox booking functionality in your React car rental application.

## Prerequisites

1. A ShareFox account and shop
2. Admin access to your ShareFox shop
3. Product IDs for the cars you want to book

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
REACT_APP_SHAREFOX_DOMAIN=your-shop-name
REACT_APP_SHAREFOX_EMAIL=your-admin-email@example.com
REACT_APP_SHAREFOX_PASSWORD=your-admin-password
REACT_APP_SHAREFOX_MERCEDES_ID=your-product-id-here
```

**Important:** Never commit the `.env` file to version control. Add it to `.gitignore`.

### 2. Update ShareFox Configuration

Edit `src/config/sharefox.js` and update the following:

- `shopDomain`: Your ShareFox shop domain (e.g., 'my-shop' for my-shop.sharefox.eu)
- `PRODUCT_IDS`: Map your car names to ShareFox product IDs

Example:
```javascript
export const PRODUCT_IDS = {
  'MERCEDES S-CLASS': 'prod_abc123',
  'BMW 5 SERIES': 'prod_def456',
  'AUDI A6': 'prod_ghi789',
};
```

### 3. Get Your ShareFox Product IDs

1. Log in to your ShareFox admin panel
2. Navigate to Products
3. Find your car products and copy their IDs
4. Add them to the `PRODUCT_IDS` mapping in `src/config/sharefox.js`

### 4. Authentication (Optional - for API features)

If you want to use the API to fetch available cars dynamically:

1. The service will authenticate using your admin credentials
2. Make sure your admin account has API access enabled
3. The token will be stored in memory (for production, consider using a backend)

### 5. Testing the Integration

1. Start your React app: `npm start`
2. Navigate to the "Availability by Days" section
3. Click "Book Now" on any car
4. The booking modal should open, or you'll be redirected to ShareFox booking page

## Features

### Current Implementation

- ✅ Book Now buttons on each car card
- ✅ Booking modal with form (name, email, phone, dates)
- ✅ Integration with ShareFox booking URLs
- ✅ Date calculation based on selected rental period
- ✅ Responsive design matching your site theme

### API Integration (Optional)

To enable dynamic car fetching from ShareFox:

1. Uncomment the API calls in `src/components/AvailabilityByDays.js`
2. Ensure authentication is set up
3. The component will fetch available cars based on selected dates

## File Structure

```
src/
├── components/
│   ├── ShareFoxBooking.js      # Booking button and modal component
│   ├── ShareFoxBooking.css     # Styles for booking component
│   └── AvailabilityByDays.js  # Updated with ShareFox integration
├── services/
│   └── sharefox.js              # ShareFox API service
└── config/
    └── sharefox.js              # ShareFox configuration
```

## API Methods Available

The ShareFox service (`src/services/sharefox.js`) provides:

- `initShareFox(domain)` - Initialize with shop domain
- `authenticateShareFox(email, password)` - Authenticate admin user
- `getAvailableProducts(startDate, endDate)` - Fetch available cars
- `createBooking(bookingData)` - Create a booking via API
- `openShareFoxBooking(options)` - Open ShareFox booking widget
- `getBookingUrl(productId, startDate, endDate)` - Get booking URL

## Customization

### Styling

The booking button and modal styles can be customized in:
- `src/components/ShareFoxBooking.css`

### Booking Flow

You can customize the booking flow in:
- `src/components/ShareFoxBooking.js`

Options:
1. Direct redirect to ShareFox booking page (current default)
2. Show booking modal with form
3. Use ShareFox API to create bookings programmatically

## Troubleshooting

### Booking button doesn't work

- Check that `PRODUCT_IDS` are correctly mapped
- Verify your ShareFox shop domain is correct
- Check browser console for errors

### API authentication fails

- Verify admin credentials in `.env`
- Ensure your admin account has API access
- Check ShareFox API documentation for any changes

### Booking modal doesn't appear

- Check browser console for JavaScript errors
- Verify React component is properly imported
- Ensure CSS is loaded

## Support

For ShareFox-specific issues:
- ShareFox Documentation: https://help.sharefox.no/
- ShareFox API Docs: https://api.mysharefox.com/docs

For integration issues:
- Check the component files for inline comments
- Review the service implementation in `src/services/sharefox.js`

## Security Notes

⚠️ **Important Security Considerations:**

1. Never expose admin credentials in client-side code
2. For production, use a backend API to handle authentication
3. Store sensitive credentials in environment variables only
4. Consider using ShareFox's embed/widget options for secure booking

## Next Steps

1. Set up your ShareFox shop and products
2. Configure environment variables
3. Map product IDs to your cars
4. Test the booking flow
5. Customize styling to match your brand
6. (Optional) Set up backend API for secure authentication




