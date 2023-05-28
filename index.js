require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// Set up mongoose
const mongoose = require('mongoose');
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
// To handle POST
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const bodyParser = require('body-parser');

////////////////////////////////////////////////////////////

app.post("/api/users", async (req, res) => {
  res.json({ log: req.body.username }) // WORKS!!!
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})

////////////////////////////////////////////////////////////

// Create a Model
const shortenerSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
    required: true
  }
});

const Url_data = mongoose.model('Url_data', shortenerSchema);

