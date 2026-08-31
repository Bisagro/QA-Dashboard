const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    const db = client.db("table");
    const collection = db.collection("csat-table");

    // Step C: Fetch raw data
    const rawData = await collection.find({}).toArray();

    // Step D: Execute your custom functions in order
    const cleanData = processDocuments(rawData);
    displayResults(cleanData);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
