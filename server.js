const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// setup middlewates
app.use(morgan('dev'))
app.use(express.json())
if (process.env.NODE_ENV === "development")
  app.use(cors());

const authMessage = {
  title: "Not Authenticated",
}

// app.get("/", (req, res) =>  {
//   res.send("Hello world");
// });

app.get("/api/trends", async (req, res) => {
  if (!BEARER_TOKEN)  {
    res.status(400).send(authMessage);
  }

  const config = {
    headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` }
  }

  try {
    const response = await axios.get(`https://api.twitter.com/1.1/trends/place.json?id=${req.query.id}`, config);
 
    if (response.status !== 200)  {
      if (response.status === 403)  {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.statusText);
      }
    }
    res.json(response.data);
  } catch(e) {
    res.status(404).send(e.response.statusText);
  }
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(PORT, () =>  {
  console.log(`Listening at http://localhost:${PORT}`);
})
