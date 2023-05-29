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
  }
});

const UserData = mongoose.model('UserData', userSchema);

app.post("/api/users", async (req, res) => {
  const postUserName = req.body.username;
  
  const userData = new UserData({
    username: postUserName
  })

  const createAndSaveDocument = async (postUserName) => {
    // find user in DB
    const isUserExist = await UserData.findOne({ username: postUserName });
    // if user doesn't exist then insert new
    if (isUserExist == null) {
      try {
        console.log("Inserting new User into database: " + postUserName);
        userData.save();
        const username = userData.username;
        const _id = userData._id;
        // return respons as object with username and id
        return res.json({username, _id});
      } catch (error) {
        console.log(error.message);
      }
    // if user is exist then show a console log
    } else {
      console.log("User is already exist in database");
    }
  }

  createAndSaveDocument(postUserName);
})

// USAGE: http://localhost:3000/api/users/6474f9d7c18749bfc4d1e4ed
app.get("/api/users/:_id", async (req, res) => {
  const userId = req.params._id;

  // find user by ID if exist
  const findUsernameById = await UserData.findById({ "_id": userId });
  console.log("User Data from DB found by id: "+findUsernameById.username+" "+findUsernameById._id);
  const username = findUsernameById.username;
  res.json({username, _id:userId});
})

// GET user's exercise log: GET /api/users/:_id/logs?[from][&to][&limit]
// Get Query Parameter Input from the Client
// https://www.freecodecamp.org/learn/back-end-development-and-apis/basic-node-and-express/get-query-parameter-input-from-the-client
