require("dotenv").config();
const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const keys = require("./keys");
const User = require("../models/user-model");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new TwitterStrategy(
    {
      // options for the twitter start
      consumerKey: keys.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.TWITTER_CONSUMER_SECRET,
      callbackURL:
        "https://twitt-dashboard.herokuapp.com/auth/twitter/redirect",
    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      process.env.TOKENN = token;
      process.env.TOKENSEC = tokenSecret;
      const currentUser = await User.findOne({
        twitterId: profile._json.id_str,
      });
      // create new user if the database doesn't have this user
      if (!currentUser) {
        const newUser = await new User({
          name: profile._json.name,
          screenName: profile._json.screen_name,
          twitterId: profile._json.id_str,
          profileImageUrl: profile._json.profile_image_url,
          tweetList: "",
        }).save();
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, currentUser);
      }
    }
  )
);
