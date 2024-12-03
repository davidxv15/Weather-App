# Weather App Backend ⛈️

The backend server for the Weather App, built with Node.js and Express.js, providing weather data and user-specific favorites.

## How the Backend Works

**Key Features**

1. **Weather Data Retrieval:**  
- Fetches real-time weather data from Tomorrow.io using latitude and longitude.
- Fetches sunrise and sunset times from Sunrise-Sunset API.  
2. **Location Autocomplete:**
- Powered by Google Places API for city suggestions in the frontend.  
3. **Favorite Cities Management:**  
- Add and remove cities from a user’s favorites.
- Store favorites in MongoDB for persistence.

