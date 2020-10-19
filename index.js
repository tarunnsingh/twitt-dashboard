const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const session = require("express-session");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const cookieParser = require("cookie-parser"); // parse cookie header

// connect to mongodb
mongoose.connect(
  keys.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongo db");
  }
);

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// parse cookies
app.use(cookieParser());
app.use(morgan("dev"));
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_HOME_PAGE_URL || "http://localhost:3000/", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

// set up routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res
      .status(401)
      .json({
        authenticated: false,
        message: "user has not been authenticated",
      })
      .redirect(process.env.CLIENT_HOME_PAGE_URL);
    next();
  } else {
    next();
  }
};

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
