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
    
    buildHead();
    buildBody(data);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } catch(e){
    console.log(e);
  }
}

function buildHead() {
  document.head.textContent = "";
  
  const metaCharset = createElement({ element: "meta" });
  metaCharset.setAttribute("charset", "UTF-8");
  
  const title = createElement({ element: "title", textContent: "QA-Dashboard" });

  const cssLink = createElement({ element: "link", href: "root.css" });
  cssLink.setAttribute("rel", "stylesheet");
  
  const favicon = createElement({ element: "link", href: "public/logo/logo.ico", type: "image/x-icon" });
  favicon.setAttribute("rel", "icon");

  document.head.append(metaCharset, title, cssLink, favicon, script);
}

function buildBody(data){
  document.body.textContent = "";
  console.log(data);
}

function createElement({element = "div", className = "", id = "", textContent = "", value = "", onClick = null, onChange = null, option = "", type = "", forWhat = "", href = "", trg = "", srf = ""}){
  const ele = document.createElement(element);
  if(className) ele.className = className;
  if(id) ele.id = id;
  if(textContent) ele.textContent = textContent;
  if(value) ele.value = value;
  if(onClick) ele.setAttribute("onclick", onClick);
  if(onChange) ele.setAttribute("onchange", onClick);
  if(option === "1") ele.readOnly = true;
  if(option === "2") ele.disabled = true;
  if(option === "3") ele.hidden = true;
  if(type) ele.type = type;
  if(forWhat) ele.setAttribute("for", forWhat);
  if(href) ele.setAttribute("href", href);
  if(srf) ele.setAttribute("src", srf);
  if(trg) ele.setAttribute("target", trg);
  
  return ele;
}

run().catch(console.dir);
