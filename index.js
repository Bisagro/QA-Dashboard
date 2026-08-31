const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

// 1. Validate URI existence upfront
const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

if (!uri) {
  console.error("FATAL ERROR: Environment variable MONGODB_SHOPEEMY_EP_URL is missing or undefined.");
  process.exit(1);
}

console.log("Environment variable loaded. Initializing MongoDB client...");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000 // Fails fast in 5 seconds if connection is blocked
});

function processDocuments(data) {
  let tableRows = '';

  data.forEach(item => {
    tableRows += `
        <tr>
          <td>${item._id || ''}</td>
          <td>${item.case || ''}</td>
          <td>${item.score || ''}</td>
          <td>${item.status || ''}</td>
        </tr>`;
  });

  return tableRows;
}

function displayResults(tableRows, totalRecords) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSAT Report Table</title>
  <link rel="stylesheet" href="root.css">
</head>
<body>
  <div class="container">
    <h2>CSAT Collection Report</h2>
    <p class="summary">Total Records: ${totalRecords}</p>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Case</th>
          <th>Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  fs.writeFileSync('index.html', htmlContent);
  console.log("Successfully generated index.html!");
}

async function run() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Connected successfully.");

    const db = client.db("table");
    const collection = db.collection("csat-table");

    console.log("Fetching documents...");
    const rawData = await collection.find({}).toArray();
    console.log(`Retrieved ${rawData.length} documents.`);

    const cleanDataRows = processDocuments(rawData);
    displayResults(cleanDataRows, rawData.length);

  } catch (error) {
    console.error("Error executing script:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

run().catch(console.dir);
