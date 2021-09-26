const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt");
const mongoose = require("mongoose");

const User = mongoose.model("user");
const keys = require("./keys")

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
};

const strategy = passport => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        done(null, user || false);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

module.exports = strategy;