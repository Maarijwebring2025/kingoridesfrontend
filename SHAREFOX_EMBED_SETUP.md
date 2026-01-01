# ShareFox Embed Integration Guide

## ✅ Solution Implemented

I've implemented **ShareFox Embed** instead of the API approach. This solves both CORS and 404 issues!

## What is ShareFox Embed?

ShareFox Embed allows you to seamlessly integrate ShareFox components directly into your website using iframes. This approach:
- ✅ **No CORS issues** - iframes can load from different domains
- ✅ **No API authentication needed** - works out of the box
- ✅ **Shows real ShareFox products** - directly from your ShareFox shop
- ✅ **Easy to implement** - just add script and div elements

## What's Been Implemented

### 1. Products Page (`/products`)
- **Advanced Search Embed** - Full search with location, dates, and filters
- **Popular Products Embed** - Shows your most popular products (up to 12 items)

### 2. Product Detail Page (`/products/:productId`)
- **Iframe Embed** - Shows the full ShareFox product page
- **Fallback Link** - Direct link to ShareFox if iframe doesn't work

## How It Works

### Script Loading
The ShareFox embed script is automatically loaded when you visit the products page:
```javascript
<script id="sharefox-embed-script" 
        data-shop="kingorides" 
        src="https://kingorides.mysharefox.com/embed.min.js" 
        async>
</script>
```

### Embed Components
The script automatically converts div elements with `class="sharefox-embed"` into iframes:

**Advanced Search:**
```html
<div data-path="search-advanced" 
     data-shop="kingorides"
     class="sharefox-embed" 
     style="width: 100%; height: 440px;">
</div>
```

**Popular Products:**
```html
<div data-path="products-popular" 
     data-volume="12"
     data-shop="kingorides"
     class="sharefox-embed" 
     style="width: 100%; min-height: 400px;">
</div>
```

## Configuration

The shop name is automatically extracted from your config:
- `shopDomain: 'kingorides.mysharefox.com'` → `shopName: 'kingorides'`

## Available Embed Types

### 1. Popular Products (`products-popular`)
- Shows your most popular products
- Configurable number of products with `data-volume`
- Products are determined by "Display Order in Shop" setting in ShareFox admin

### 2. Simple Search (`search`)
- Basic search bar
- Redirects to ShareFox search results

### 3. Advanced Search (`search-advanced`)
- Full search with filters:
  - Location
  - Pickup date/time
  - Return date/time
- Redirects to filtered search results

## Customization

### Adjust Number of Products
In `ProductsPage.js`, change the `data-volume` attribute:
```jsx
<div 
  data-path="products-popular" 
  data-volume="8"  // Change this number
  ...
/>
```

### Adjust Search Height
In `ProductsPage.js`, adjust the height style:
```jsx
style={{ width: '100%', maxWidth: '800px', margin: '0 auto', height: '500px' }}
```

### Styling
The embeds are styled in `ProductsPage.css`:
- `.sharefox-search-container` - Search container styling
- `.sharefox-products-container` - Products container styling
- `.sharefox-embed` - Embed iframe styling

## Testing

1. **Start your dev server:**
   ```bash
   npm start
   ```

2. **Navigate to `/products`:**
   - You should see the advanced search embed
   - Below that, popular products should load

3. **Check browser console:**
   - Look for "ShareFox Embed script loaded successfully"
   - No CORS errors should appear

4. **Test the search:**
   - Fill in the search form
   - Click search - it should redirect to ShareFox search results

5. **Test product clicks:**
   - Click on a product in the popular products embed
   - It should navigate to the ShareFox product page

## Troubleshooting

### Embeds Not Loading?
1. Check browser console for errors
2. Verify the script is loading: Look for `sharefox-embed-script` in the DOM
3. Check network tab: `embed.min.js` should load successfully
4. Verify shop name: Should be `kingorides` (not `kingorides.mysharefox.com`)

### Products Not Showing?
1. Check ShareFox admin:
   - Go to Settings → Template → Top Products (enable if needed)
   - Set "Display Order in Shop" for products you want to show
2. Verify `data-volume` is set correctly
3. Check if products are published in ShareFox

### Search Not Working?
1. Verify the search embed is loading
2. Check if ShareFox search is enabled for your shop
3. Try the simple search embed instead

## Next Steps

1. **Customize the number of products** - Adjust `data-volume` in `ProductsPage.js`
2. **Style the embeds** - Modify CSS in `ProductsPage.css`
3. **Add more embed types** - Add simple search or other components
4. **Test on mobile** - Ensure embeds are responsive

## Benefits Over API Approach

| Feature | API Approach | Embed Approach |
|---------|-------------|----------------|
| CORS Issues | ❌ Yes | ✅ No |
| API Authentication | ❌ Required | ✅ Not needed |
| Setup Complexity | ❌ High | ✅ Low |
| Maintenance | ❌ High | ✅ Low |
| Real-time Updates | ❌ Manual sync | ✅ Automatic |
| ShareFox Features | ❌ Limited | ✅ Full access |

## Files Modified

1. `src/components/ProductsPage.js` - Replaced API calls with embeds
2. `src/components/ProductsPage.css` - Added embed styling
3. `src/components/ProductDetailPage.js` - Added iframe embed
4. `src/components/ProductDetailPage.css` - Added iframe styling

## Documentation

For more information, see:
- ShareFox Embed Documentation: https://help.sharefox.no/article/embed
- Embed Wizard: https://drfr0st.github.io/sharefox-embed-wiz/

