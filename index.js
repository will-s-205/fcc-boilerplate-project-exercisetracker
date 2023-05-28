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
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const exTrackDB = mongoose.model('DB', shortenerSchema);

const createAndSaveDocument = async (urlString) => {
  try {
    const count = await DB.find().count();
    const url = await new DB({
      userName: urlString,
      userId: count
    });
    url.save();
    return url;
  } catch (error) {
    console.log(error.message);
  }
}
