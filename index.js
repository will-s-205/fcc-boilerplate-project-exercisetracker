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
  // res.json({ postUserName, userId });

  const createAndSaveDocument = async (postUserName) => {
    // find user in DB
    const isUserExist = await UserData.findOne({ username: postUserName });
    // if user doesn't exist then insert new
    if (isUserExist == null) {
      try {
        console.log("Inserting new User into database: " + postUserName);
        const userData = new UserData({
          username: postUserName
        })
        userData.save();
        const username = userData.username;
        const _id = userData._id;
        return res.json({username, _id});
        // return res.json({userData});
      } catch (error) {
        console.log(error.message);
      }
    // if user exist then show a
    } else {
      console.log("User is already exist in database");
    }
  }

  createAndSaveDocument(postUserName);


})

app.post("/api/users/:_id/exercises", async (req, res) => {
  // const postUserId = req.body._id;
  // const userId = " "
  let userId = req.body._id;
  console.log(userId);

  const createAndSaveDocument = async (postUserName) => {
    const isIdExist = await UserData.findOne({ "_id": req.params._id });
    console.log(isIdExist);

    // if (isUserExist == null) {
    //   try {
    //     console.log("Inserting new User into database: " + postUserName);
    //     const userData = new UserData({
    //       username: postUserName
    //     })
    //     userData.save();
    //     return res.json({userData});
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // } else {
    //   console.log("User is already exist in database");
    // }
  }

  // createAndSaveDocument(postUserName);


})

// GET user's exercise log: GET /api/users/:_id/logs?[from][&to][&limit]
// Get Query Parameter Input from the Client
// https://www.freecodecamp.org/learn/back-end-development-and-apis/basic-node-and-express/get-query-parameter-input-from-the-client
