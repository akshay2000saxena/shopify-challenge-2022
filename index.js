const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const swagger = require("express-swagger-generator");

// import routes
const users = require("./routes/api/Users");
const photos = require("./routes/api/Photos");

// start express
const app = express();

// set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require("./config/passport")(passport);


// set up mongodb
const mongodb = keys.mongoURL;
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongoDB"))
  .catch(err => console.error(err));

// set up cloudinary
const { cloudName, apiKey, apiSecret } = keys.cloudinaryConfig;
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
})

// set up user and photo routes
app.use("/api/users", users);
app.use("/api/photos", photos);

// home page
app.get("/", (req, res) => {
  res.json({ message: "Feel free to add front end here!" });
});

// hosts up docs on /api-docs
const expressSwagger = swagger(app);
expressSwagger({
  swaggerDefinition: {
    info: {
      description: "Documenation",
      title: "Photo Database Application",
      version: "1.0.0"
    },
    host: "localhost:3000/",
    basePath: "/",
    produces: ["application/json", "application/xml"],
    schemes: ["http", "https"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: ""
      }
    }
  },
  basedir: __dirname,
  files: ["./routes/**/*.js", "./models/**/*.js"]
});

// inititialize port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));

// export for testing purposes
module.exports = app;