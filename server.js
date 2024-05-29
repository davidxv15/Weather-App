const express = require('express'); // Corrected _require_ statement
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variable

const app = express(); 
const port = 3000;

app.use(express.json()); // middleware
app.use(cors());

const apiKey = process.env.API_KEY;

// const unitMappings = {
//     "Celsius": "Fahrenheit", // Add Celsius to Fahrenheit conversion
//   };
  
// Define route to fetch weather data
app.get('/weather', async (req, res) => {
    console.log('Route handler is executing');
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }

  try {
    // request to external API (tommorow.io for this one)
    const response = await axios.get('https://api.tomorrow.io/v4/weather/forecast', {
      params: {
        location, 
        apikey: apiKey,
        fields: 'temperature,temperatureApparent,uvIndexdewPoint,humidity,windSpeed,windDirection',
      }
    });

    console.log('API Response:', response.data); // API response

    // Check if  response contains needed data
    if (response.data.timelines && response.data.timelines.minutely && response.data.timelines.minutely.length > 0) {
        // Get the first minute forecast
        const minuteForecast = response.data.timelines.minutely[0];

    // Log temperature values before conversion
console.log('Temperature Celsius:', minuteForecast.values.temperature);
console.log('Temperature Apparent Celsius:', minuteForecast.values.temperatureApparent);

    // weather parameters
    const weatherData = {
        weatherCode: minuteForecast.values.weatherCode,
        temperature: minuteForecast.values.temperature,
        temperatureApparent: minuteForecast.values.temperatureApparent,
        uvIndex: minuteForecast.values.uvIndex,
        dewPoint: minuteForecast.values.dewPoint,
        humidity: minuteForecast.values.humidity,
        windSpeed: minuteForecast.values.windSpeed,
        windDirection: minuteForecast.values.windDirection,
        // visibility: minuteForecast.values.visibility
        // windGust: minuteForecast.values.windGust,
        // sunriseTime: minuteForecast.values.sunriseTime,
        // sunsetTime: minuteForecast.values.sunsetTime
      };


 
      
 // Convert temperature values from Celsius to Fahrenheit
 console.log('Temperature Fahrenheit:', weatherData.temperature.value);
        console.log('Temperature Apparent Fahrenheit:', weatherData.temperatureApparent.value);

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

// route to save weather data to database (later)
app.post('/weather', (req, res) => {
  // placeholder for saving weather data to database
  // will be implemented on connect of dB
  res.status(501).json({ message: 'Not implemented' });
});

 app.get('/', (req, res) => {
        res.send('Welcome to the Weather App!');
      });


      
function convertTemperature(celsius) {
        return (celsius * 9/5) + 32;
      }      
console.log(convertTemperature(0)); 
console.log(convertTemperature(100));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
