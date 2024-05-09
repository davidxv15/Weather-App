const express = require('express'); // Corrected require statement
const axios = require('axios'); // Added import statement for axios
const app = express(); // Corrected variable name


const port = 3000;

app.use(express.json()); // Corrected middleware setup

// Define route to fetch weather data
app.get('/weather', async (req, res) => {
  try {
    // Make a request to an external weather API (replace 'YOUR_API_KEY' with your actual API key)
    const response = await axios.get('https://api.tomorrow.io/v4/weather/forecast', {
      params: {
        // You can pass query parameters if needed (e.g., location)
        // location: req.query.location
        location: '42.3478,-71.0466', 
        apikey:'1KF9l15qvhMPJXIDgtAuTFvIgDw1Tbcx',
      }
    });

    console.log('API Response:', response.data); // Log the API response

    // Check if the response contains the necessary data
    if (response.data.timelines && response.data.timelines.minutely && response.data.timelines.minutely.length > 0) {
        // Get the first minute forecast
        const minuteForecast = response.data.timelines.minutely[0];
  
      
    // if (response.data.timelines && response.data.timelines.length > 0 &&
    //     response.data.timelines[0].intervals && response.data.timelines[0].intervals.length > 0) {

    // Extract weather parameters
    const weatherData = {
        temperature: minuteForecast.values.temperature,
        dewPoint: minuteForecast.values.dewPoint,
        humidity: minuteForecast.values.humidity,
        windSpeed: minuteForecast.values.windSpeed,
        windDirection: minuteForecast.values.windDirection,
        windGust: minuteForecast.values.windGust,
        // Add more weather parameters as needed
      };
   // Assuming the API response contains weather data
    res.json(weatherData);
} else {
    // If timelines or intervals arrays are not present in the response, return an error
    throw new Error('Timelines or Intervals Data not found in API response');
  }
    

  } catch (error) {
    // Handle errors
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Internal server is an eRRor' });
  }
});

// Define route to save weather data to database (to be implemented later)
app.post('/weather', (req, res) => {
  // Placeholder for saving weather data to database
  // This will be implemented when you connect your database
  res.status(501).json({ message: 'Not implemented' });
});

 app.get('/', (req, res) => {
        res.send('Welcome to the Weather App!');
      });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
