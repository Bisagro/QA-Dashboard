const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const path = require('path');

const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

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
    res.status(500).json({ error: 'Failed to get CSAT data' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
