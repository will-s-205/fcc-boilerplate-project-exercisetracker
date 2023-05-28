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

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})

// Connect database
mongoose.connect(process.env.MONGO_URI);

// Create a Model
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

const UserData = mongoose.model('UserData', userSchema);

const createAndSaveDocument = async (userString) => {
  try {
    const count = await UserData.find().count();
    const user = await new UserData({
      userName: userString,
      userId: count
    });
    user.save();
    return user;
  } catch (error) {
    console.log(error.message);
  }
}

app.post("/api/users", async (req, res) => {
  res.json({ log: req.body.username }) // WORKS!!!
  createAndSaveDocument("useruser");
})

