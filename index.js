const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');

// Secret environment variable matching your MongoDB connection string
const uri = process.env.MONGODB_SHOPEEMY_EP_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Helper function to format raw MongoDB data into HTML table rows
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

// Helper function to build the complete HTML page and save it to index.html
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

  // Write file out so GitHub Pages can serve it
  fs.writeFileSync('index.html', htmlContent);
  console.log("Successfully generated index.html!");
}

async function run() {
  try {
    await client.connect();
    
    const db = client.db("table");
    const collection = db.collection("csat-table");

    // Fetch raw data
    const rawData = await collection.find({}).toArray();

    // Process rows & generate index.html
    const cleanDataRows = processDocuments(rawData);
    displayResults(cleanDataRows, rawData.length);

  } catch (error) {
    console.error("Error executing script:", error);
    process.exit(1);
  } finally {
    // Ensures that the client will close when finished/errored
    await client.close();
  }
}

run().catch(console.dir);
