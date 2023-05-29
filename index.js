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
const shortId = require('shortid');

////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})

// Connect to database
mongoose.connect(process.env.MONGO_URI);

// Create a Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

const UserData = mongoose.model('UserData', userSchema);

app.post("/api/users", async (req, res) => {
  const postUserName = req.body.username;

  const createAndSaveDocument = async (postUserName) => {
    const isUserExist = await UserData.findOne({ username: postUserName });
    if (isUserExist == null) {
      try {
        console.log("Inserting new User into database: " + postUserName);
        const userData = new UserData({
          username: postUserName,
          userId: shortId.generate()
        });
        userData.save();
        return userData;
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("User is already exist in database");
    }
  }

  createAndSaveDocument(postUserName);


})
