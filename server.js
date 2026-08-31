const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const data = await client.db("table").collection("csat-table").find({}).toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } catch(e){
    console.log(e);
  }
}

run().catch(console.dir);
