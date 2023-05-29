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
  userName: {
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
  // res.json({ log: postUserName })



  const createAndSaveDocument = async (postUserName) => {
    const isUserExist = await UserData.findOne({ userName: postUserName });
    if (isUserExist == null) {
      try {
        console.log("Inserting new User into database: " + postUserName);
        // const count = await UserData.find().count();
        const userData = await new UserData({
          userName: postUserName,
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



// app.post("/api/shorturl", async (req, res) => {
//   try {
//     const url = new URL(req.body.url);
//     if (!['http:', 'https:'].includes(url.protocol)) throw Error;
//     const url_data = await Url_data.findOne({ original_url: url });
//     if (url_data != null) {
//       req.link = url_data;
//     } else {
//       req.link = await createAndSaveDocument(url);
//     }
//     const { original_url, short_url } = req.link;
//     res.json({ original_url, short_url });
//   }
//   catch (error) {
//     res.json({ error: 'invalid url' })
//   }
// })

