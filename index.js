const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Access the API key stored as a secret in your environment
const OPENAI_API_KEY = process.env['OPENAI_API_KEY'];

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Keywords to Ads Mapping
const keywordsAdsMapping = {
  'Car': { text: 'Explore Cars!', url: 'https://www.cars.com/' },
  'Bike': { text: 'Ride Bikes!', url: 'https://www.bikesonline.com/' },
  'Train': { text: 'Travel by Train!', url: 'https://www.amtrak.com/' },
  'Plane': { text: 'Fly High!', url: 'https://www.airlines.com/' },
  'Motorcycle': { text: 'Ride a Motorcycle!', url: 'https://www.motorcycle.com/' },
  'Truck': { text: 'Drive Trucks!', url: 'https://www.trucks.com/' },
  'Boat': { text: 'Sail Boats!', url: 'https://www.boattrader.com/' },
  'Scooter': { text: 'Use Scooters!', url: 'https://www.electricscooterstore.com/' },
};

app.get('/', (req, res) => {
  res.send('Your Backend is running');
});

app.post('/query', async (req, res) => {
  try {
    // validateRequestBody(req); // Uncomment and define this if you need it

    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const MODEL_ID = 'gpt-3.5-turbo-16k-0613';

    const messages = [
      {
        role: 'user',
        content: req.body.query,
      },
    ];

    const result = await axios.post(OPENAI_API_ENDPOINT, {
      model: MODEL_ID,
      messages: messages
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    });

    const chatResponse = result.data.choices[0].message.content.trim();
    const matchedAds = keywordsAdsMapping[chatResponse] || "No ads";

    res.json({ response: chatResponse, ads: matchedAds });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ response: 'An error occurred while fetching the response' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
