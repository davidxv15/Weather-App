const express = require("express"); // Corrected _require_ statement
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

dotenv.config(); // Load environment variable

const app = express();
const port = 3000;

app.use(express.json()); // middleware
app.use(cors());

const apiKey = process.env.API_KEY;
const geoApiKey = process.env.GEO_API_KEY;
const googlePlacesApiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
const mongoUri = process.env.MONGODB_URI;

console.log("Connecting to MongoDB...");

let db;
let favoritesCollection;

MongoClient.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db("weatherApp");
    favoritesCollection = db.collection("favorites");
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Function to gets coordinates from location typed
async function getCoordinates(location) {
  const response = await axios.get(
    "https://api.opencagedata.com/geocode/v1/json",
    {
      params: {
        q: location,
        key: geoApiKey,
      },
    }
  );
  const data = response.data;

  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  } else {
    throw new Error("Location not found");
  }
}

// Define route to fetch weather data
app.get("/weather", async (req, res) => {
  console.log("Route handler is executing");
  const location = req.query.location;
  console.log("Received location: ", location);

  if (!location) {
    return res.status(400).json({ message: "Location parameter is required" });
  }

  try {
    const { lat, lng } = await getCoordinates(location);
    console.log(`Coordinates for ${location}: ${lat}, ${lng}`);

    // request to external API (tommorow.io for this one)
    const response = await axios.get(
      "https://api.tomorrow.io/v4/weather/forecast",
      {
        params: {
          location: `${lat},${lng}`,
          apikey: apiKey,
          fields:
            "temperature,temperatureApparent,uvIndex,dewPoint,humidity,windSpeed,windDirection,sunriseTime,sunsetTime",
        },
      }
    );

    console.log("API Response:", response.data); // API response

    // Check if  response contains needed data
    if (
      response.data.timelines &&
      response.data.timelines.minutely &&
      response.data.timelines.minutely.length > 0
    ) {
      // Get the first minute forecast
      const minuteForecast = response.data.timelines.minutely[0];

      // Log temperature values before conversion
      console.log("Temperature Celsius:", minuteForecast.values.temperature);
      console.log(
        "Temperature Apparent Celsius:",
        minuteForecast.values.temperatureApparent
      );

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
        sunriseTime: minuteForecast.values.sunriseTime,
        sunsetTime: minuteForecast.values.sunsetTime
        // visibility: minuteForecast.values.visibility
        // windGust: minuteForecast.values.windGust,
      };

      // Convert temperature values from Celsius to Fahrenheit
      console.log("Temperature Fahrenheit:", weatherData.temperature.value);
      console.log(
        "Temperature Apparent Fahrenheit:",
        weatherData.temperatureApparent.value
      );

      // Assuming the API response contains weather data
      res.json(weatherData);
    } else {
      // If timelines or intervals arrays are not present in the response, return an error
      throw new Error("Timelines or Intervals Data not found in API response");
    }
  } catch (error) {
    // Handle errors
    console.error("Error fetching weather data:", error);
    res.status(500).json({ message: "Internal server is an eRRor" });
  }
});

app.post("/favorites", async (req, res) => {
  const { location } = req.body;
  if (!location) {
    return res.status(400).json({ message: "Location is required" });
  }

  try {
    const existingFavorite = await favoritesCollection.findOne({ location });
    if (existingFavorite) {
      await favoritesCollection.deleteOne({ location });
      res.json({ message: "Location removed from favorites" });
    } else {
      await favoritesCollection.insertOne({ location });
      res.json({ message: "Location added to favorites" });
    }
  } catch (error) {
    console.error("Error handling favorite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/favorites", async (req, res) => {
  try {
    const favorites = await favoritesCollection.find().toArray();
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch place suggestions
app.get("/places", async (req, res) => {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ message: "Input parameter is required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${googlePlacesApiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching place suggestions:", error);
    res.status(500).json({ message: "Error fetching place suggestions" });
  }
});

// route to save weather data to database (later)
app.post("/weather", (req, res) => {
  // placeholder for saving weather data to database
  // will be implemented on connect of dB
  res.status(501).json({ message: "Not implemented" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Weather App!");
});

function convertTemperature(celsius) {
  return (celsius * 9) / 5 + 32;
}
console.log(convertTemperature(0));
console.log(convertTemperature(100));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
