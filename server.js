const express = require('express'); 
const axios = require('axios');
const app = express(); 

const port = 4000;

app.use(express.json()); 


app.get('/weather', async (req, res) => {
  try {
    
    const response = await axios.get('https://api.example.com/weather', {
      params: {
       
      }
    });
    
    
    const weatherData = response.data;
    res.json(weatherData);
  } catch (error) {
   
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/weather', (req, res) => {
  
  res.status(501).json({ message: 'Not implemented' });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
