const router = require("express").Router();
const Twit = require("twit");
const keys = require("../config/keys");

const T = new Twit({
  consumer_key: keys.TWITTER_CONSUMER_KEY,
  consumer_secret: keys.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET,
});

router.get("/getTweets", (req, res) => {
  T.get("statuses/home_timeline", { count: 200 }, function (
    err,
    data,
    response
  ) {
    const strData = JSON.stringify(data);
    console.log(typeof strData);
    req.user.tweetList = strData;
    req.user.save((err) => {
      if (err)
        return res
          .status(500)
          .json({ message: { msgBody: "An Error Occured!", msgError: true } });
      else {
        return res.status(200).json({
          message: {
            msgBody: "Succesfully added to User",
            msgError: false,
            tweetList: strData,
          },
        });
      }
    });
  });
});

module.exports = router;
