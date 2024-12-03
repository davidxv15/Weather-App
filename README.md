# Weather App Backend ⛈️  

The backend server for the Weather App, built with Node.js and Express.js, provides weather data and user-specific favorites.

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

### Technology Used:  
**Backend:**  
* **Node.js & Express.js**: Frameworks for server-side logic and REST API development.  
* **MongoDB**: Database for storing favorite cities.  
* **Mongoose**: ODM for easy database interaction. 
* **Axios**: For API calls to external weather services.  
**APIs**  
* **Tomorrow.io**: Real-time weather data.  
* **Google Places API**:  Location autocomplete.  
* **Sunrise-Sunset API**: Sunrise and sunset times.  

**How to Run Locally**:
1. Clone the repository:  
`git clone https://github.com/davidxv15/weather-app.git`  
`cd weather-app`  
2. Install dependencies:  
`npm install`  
3. Set up environment variables:  
`MONGODB_URI=your_mongodb_uri`  
`GOOGLE_PLACES_API_KEY=your_google_places_api_key`  
`TOMORROW_API_KEY=your_tomorrow_api_key`  
4. Start the server:
`node server.js`  
5. The server will run on:  
`http://localhost:3000`  


