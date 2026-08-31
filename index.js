const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

if (!uri) {
  console.error("FATAL ERROR: Environment variable MONGODB_SHOPEEMY_EP_URL is missing or undefined.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 5000
});

// Helper function to format raw MongoDB data into HTML table rows
function processDocuments(data) {
  let tableRows = '';

  data.forEach(item => {
    // Explicitly handle boolean mapping so `false` isn't hidden
    let csatDisplay = '';
    if (typeof item.csat === 'boolean') {
      csatDisplay = item.csat ? 'TRUE' : 'FALSE';
    } else if (item.csat !== undefined && item.csat !== null) {
      csatDisplay = String(item.csat);
    }

    tableRows += `
        <tr>
          <td>${item._id || ''}</td>
          <td>${item.case || ''}</td>
          <td>${csatDisplay}</td>
          <td>${item.status || ''}</td>
        </tr>`;
  });

  return tableRows;
}

// Helper function to build complete HTML page
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
          <th>CSAT</th>
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
    console.log("Connecting to MongoDB...");
    await client.connect();
    
    const db = client.db("table");
    const collection = db.collection("csat-table");

    console.log("Fetching documents...");
    const rawData = await collection.find({}).toArray();
    console.log(`Retrieved ${rawData.length} records.`);

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
