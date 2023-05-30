// GET user's exercise log: GET /api/users/:_id/logs?[from][&to][&limit]
// https://exercise-tracker.freecodecamp.rocks/

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

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USERS

// Connect to database
mongoose.connect(process.env.MONGO_URI);

// Create a Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number
  },
  date: {
    type: String
  }
});

const UserData = mongoose.model('UserData', userSchema);

app.post("/api/users", async (req, res) => {
  const postUserName = req.body.username;

  const userData = new UserData({
    username: postUserName,
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
        const description = userData.description;
        const duration = userData.duration;
        const date = userData.date;
        // return respons as object with data
        return res.json({ username, _id, description, duration, date });
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
  .get("/api/users", async (req, res) => {
    // const userData = new UserData({
    //   username
    // })
    const users = await UserData.find();
    res.json(users);
  })



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXERCISE

// Create a Model
const exercisesSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: String
  }
});

const ExercisesData = mongoose.model('ExercisesData', exercisesSchema);

app.post("/api/users/:_id/exercises", async (req, res) => {
  const postUserId = req.params._id;

  const findExerciseById = await UserData.findById({ _id: postUserId });
  const updateExerciseById = async (postUserId) => {
    if (findExerciseById != null) {

      if (
        req.body.description === "" ||
        req.body.duration === "" ||
        req.body.userId === ""
      ) {
        return res.json({ error: "please enter required fields" });
      }

      try {
        console.log("User Data from DB found by id: " +
          findExerciseById.username + " " +
          findExerciseById._id + " " +
          findExerciseById.description + " " +
          findExerciseById.duration + " " +
          findExerciseById.date);

        await findExerciseById.updateOne({
          description: req.body.description,
          duration: req.body.duration,
          date: (req.params.date) ? new Date(req.params.date) : new Date()
        })

        return res.json({
          username: findExerciseById.username,
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date,
          _id: postUserId
        });

      } catch (error) {
        console.log(error.message);
      }

      // if id does not exist then show a console log
    } else {
      console.log("Requested ID does NOT exist in database");
      return res.json({ "error": "Requested ID does NOT exist in database" })
    }
  }

  updateExerciseById(postUserId);
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DEBBUGING
// USAGE: http://localhost:3000/api/users/6474f9d7c18749bfc4d1e4ed
app.get("/api/users/:_id", async (req, res) => {
  const userId = req.params._id;
  console.log("\"GET ./api/users/:_id\"");

  // find user by ID if exist
  const findUsernameById = await UserData.findById({ "_id": userId });
  console.log("\"User Data from DB found by id: " + findUsernameById.username + " " + findUsernameById._id + " " + findUsernameById.description + " " + findUsernameById.duration + " " + findUsernameById.date + "\"");
  const username = findUsernameById.username;
  const description = findUsernameById.description;
  const duration = findUsernameById.duration;
  const date = findUsernameById.date;
  res.json({ username, _id: userId, description, duration, date }); // OUTPUT: {"username":"rigo205@mail.com","_id":"647500f1ae45493e02adca23"}
  console.log("\"duration is a: " + typeof findUsernameById.duration + "\"")
})
