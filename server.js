const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

app.get('/api/csat', async (req, res) => {
  try {
    await client.connect();

    const data = await client
      .db('table')
      .collection('csat-table')
      .find({})
      .toArray();

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to get CSAT data'
    });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
