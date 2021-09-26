const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const keys = require("./config/keys");

const users = require("./routes/Users");
const photos = require("./routes/Photos");

const app = express();



require("./config/passport")(passport);


// set up mongodb
const mongodb = keys.mongoURL;
mongoose.connect(mongodb, {})
  .then(() => console.log("Connected to mongoDB"))
  .catch(err => console.error(err));

// set up cloudinary
const { cloudName, apiKey, apiSecret } = keys.cloudinaryConfig;
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
})

app.get("/", (req, res) => {

});


app.listen(3000, () => console.log("Server is listening to port 3000"));