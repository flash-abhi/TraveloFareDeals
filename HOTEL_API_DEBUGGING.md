# Hotel API Debugging Guide

## Issue: Hotels Not Showing on Results Page

When searching for hotels, the user is taken to `/hotel-results` but no hotels are displayed.

## Root Causes & Solutions

### 1. Backend Server Not Running

**Check if backend is running:**
```bash
# The backend should be running on port 5000 (or your configured port)
curl http://localhost:5000/api/hotels/test/ping
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hotels API is working",
  "amadeusEnabled": false,
  "timestamp": "2024-04-15T10:30:00.000Z"
}
```

**If no response:**
- Start the backend server:
```bash
cd backend
npm install  # if not done
node server.js
# OR
npm start
```

### 2. Test Mock Hotels Endpoint

To verify the API is returning data:

```bash
curl "http://localhost:5000/api/hotels/test/mock"
```

**Expected Response:** Should return 1 test hotel with all required fields (name, price, rating, etc.)

### 3. Test Actual Hotel Search

Replace dates with today's date:

```bash
curl "http://localhost:5000/api/hotels?cityCode=PARIS&checkInDate=2024-04-15&checkOutDate=2024-04-18&adults=2&roomQuantity=1"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "1",
      "name": "Luxury Grand Hotel",
      "rating": 4.8,
      ...
    }
  ],
  "source": "mock"
}
```

If you see `"source": "mock"`, it means:
- ✅ Backend is returning mock data (working as fallback)
- This is the expected behavior when APIs are not configured

## Frontend Debugging

### Check Browser Console

Open Developer Tools (F12) and look at:

1. **Console Tab** - Look for logs from HotelResults.js:
   - Should see: `🔍 Fetching hotels with params: {...}`
   - Should see: `📊 API Response: {...}`
   - Should see: `✅ Received X hotels from API`

2. **Network Tab** - Check the `/api/hotels?...` request:
   - Status should be 200
   - Response should have `"success": true` and `"data": [...]`

### Common Frontend Issues

**Issue: "No hotels found" message**
- Hotels array is empty but no error message
- Check: Is the API returning `data: []`?
- Solution: Check backend logs

**Issue: "Error connecting to server"**
- Check: Is backend running on the correct port?
- Check: Is CORS enabled? (It should be in server.js)
- Solution: Restart backend and check console for errors

## Backend Debugging

### Check Backend Console Logs

When searching for hotels, you should see logs like:

```
📍 Hotel search request received with params: { cityCode: 'PARIS', ... }
✅ Search parameters received. Searching for hotels...
🔍 Searching Amadeus hotels for: PARIS
⚠️  No hotels found by Amadeus for city: PARIS
📋 Returning MOCK hotel data (APIs and database returned no results)
```

### Verify Amadeus API (Optional)

If you have Amadeus credentials:

```bash
# Check if environment variables are set
echo $AMADEUS_CLIENT_ID
echo $AMADEUS_CLIENT_SECRET

# If empty, add to .env file:
# AMADEUS_CLIENT_ID=your_client_id
# AMADEUS_CLIENT_SECRET=your_client_secret
```

## API Response Format

The backend should always return this format:

```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": "1",
      "name": "Hotel Name",
      "rating": 4.5,
      "location": {
        "city": "PARIS",
        "address": "Street Address",
        "cityName": "Paris",
        "coordinates": null
      },
      "price": {
        "perNight": 125,
        "total": 375,
        "currency": "USD"
      },
      "availability": {
        "checkInDate": "2024-04-15",
        "checkOutDate": "2024-04-18",
        "nights": 3
      },
      "room": {
        "type": "Standard Room",
        "sleeps": 2
      },
      "amenities": ["WiFi", "Restaurant", "Parking"],
      "media": [
        {
          "uri": "https://images.unsplash.com/photo-..."
        }
      ],
      "description": "Hotel description",
      "source": "mock"
    }
  ],
  "source": "mock",
  "message": "Showing sample hotels. Connect Amadeus API for real data."
}
```

## Quick Fix Checklist

- [ ] Backend is running on port 5000
- [ ] Test `/api/hotels/test/ping` returns 200
- [ ] Test `/api/hotels/test/mock` returns 1 hotel
- [ ] Try with correct date format (YYYY-MM-DD)
- [ ] Check browser console for errors
- [ ] Check backend console for logs
- [ ] CORS is enabled in server.js
- [ ] Hotels route is registered in server.js

## If Still Not Working

1. **Check backend logs** - Look for error messages
2. **Restart backend** - Fresh start might help
3. **Clear browser cache** - Sometimes caches cause issues
4. **Check network tab** - Verify request/response
5. **Verify port** - Is backend on correct port?

## Expected Behavior

1. User navigates to `/hotels`
2. User fills in search form (destination, dates, guests)
3. Clicks "Search Hotels" button
4. Navigates to `/hotel-results` with state
5. HotelResults component fetches from `/api/hotels?...`
6. Backend returns mock hotels (or real data if APIs configured)
7. Hotels are displayed in a grid with sorting options

---

**Note:** The system is designed to:
1. Try Amadeus API first (if configured)
2. Try Sabre API second (if configured)
3. Query database third (if hotels exist in DB)
4. Fall back to mock hotels (guaranteed to work)

This ensures hotels are always shown to users!
