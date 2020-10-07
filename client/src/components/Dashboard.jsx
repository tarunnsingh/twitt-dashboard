import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { Twitter } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https:/tarunsingh.tech/">
        Tarun Singh
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    overflowY: "scroll",
    display: "block",
    height: "600px",
    borderWidth: "5px",
    borderColor: theme.palette.primary,
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  marginAutoItem: {
    margin: "auto",
  },
  avatarDiv: {
    paddingTop: theme.spacing(5),
  },
}));

export default function Dasboard() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [tweetList, setTweetList] = useState([]);
  const [maxUser, setMaxUser] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [maxHostname, setMaxHostname] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLogginIn] = useState(false);

  useEffect(() => {
    setIsLogginIn(true);
    fetch("/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        setIsLogginIn(false);
        throw new Error("failed to authenticate user");
      })
      .then((responseJson) => {
        console.log(responseJson.user);
        setUser(responseJson.user);
        setAuthenticated(true);
        setIsLogginIn(false);
      })
      .catch((error) => {
        setAuthenticated(false);
        setIsLogginIn(false);
        setError("Failed to Authenticate User, Please Retry.");
      });
  }, []);

  const onLoginClick = (e) => {
    setIsLogginIn(true);
    e.preventDefault();
    window.open("http://localhost:4000/auth/twitter", "_self");
    setIsLogginIn(false);
  };

  const onLogoutClick = (e) => {
    e.preventDefault();
    fetch("/auth/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        console.log("On Logout : ", res);
        setAuthenticated(false);
        setTweetList([]);
        setMaxHostname(null);
        setMaxUser(null);
        setMaxValue(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGetTweets = () => {
    setIsLoading(true);
    fetch("/user/getTweets", {
      method: "GET",
    })
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          const list = JSON.parse(data.message.tweetList);

          let newList = list.filter((tweet) => {
            if (tweet.entities.urls.length !== 0) return tweet;
          });
          setTweetList(newList);
          console.log(newList);
          setIsLoading(false);
          return data;
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const findTopUser = () => {
    console.log("TOP USER");
    let map = new Map();
    tweetList.forEach((tweet) => {
      let username = tweet.user.screen_name;
      if (map.has(username)) {
        map.set(username, map.get(username) + 1);
      } else {
        map.set(username, 1);
      }
    });
    let max_value = 1;
    let max_user = "";
    map.forEach((value, key) => {
      if (value > max_value) {
        max_value = value;
        max_user = key;
      }
    });
    console.log("MAX USER: ", max_user);
    console.log("MAX VALUE", max_value);
    setMaxUser(max_user);
    setMaxValue(max_value);
  };

  const findTopDomain = () => {
    console.log("TOP DOMAIN");
    let map = new Map();
    tweetList.forEach((tweet) => {
      let urls = tweet.entities.urls;

      urls.map((url) => {
        let parseURL = new URL(url.expanded_url);
        let hostname = parseURL.hostname;
        // console.log(hostname);
        if (map.has(hostname)) {
          map.set(hostname, map.get(hostname) + 1);
        } else {
          map.set(hostname, 1);
        }
      });
    });
    let max_hostname = "";
    let max_val = 1;
    map.forEach((value, key) => {
      if (value > max_val) {
        max_val = value;
        max_hostname = key;
      }
    });
    console.log("MAX HOST: ", max_hostname);
    setMaxHostname(max_hostname);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Twitter className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            Twitter Dasboard
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        {authenticated ? (
          <div className={classes.avatarDiv}>
            <Avatar
              alt="Profile Photo"
              align="center"
              src={user.profileImageUrl}
              className={(classes.large, classes.marginAutoItem)}
            />
            <Typography variant="h6" align="center" color="textSecondary">
              {" "}
              Hi! {user.name}
            </Typography>
          </div>
        ) : null}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Your Tweet Activity
            </Typography>

            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Find out what URLs/Links have been in the trend in the last week.
              Data crunched from your tweets and your friends tweet.
            </Typography>

            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  {authenticated ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onLogoutClick}
                    >
                      <Twitter className={classes.icon} />
                      Log Out
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onLoginClick}
                    >
                      <Twitter className={classes.icon} />
                      Log In
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={!authenticated}
                    onClick={handleGetTweets}
                  >
                    Get Tweets with URLs
                  </Button>
                </Grid>

                <Grid item xs={12} align="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={!authenticated}
                    onClick={findTopUser}
                    gutterBottom
                    disbaled={!authenticated && tweetList.length === 0}
                  >
                    User who shared Maximum URLs
                  </Button>
                  <Typography variant="h6" align="center" color="textSecondary">
                    {maxValue && maxUser
                      ? `${maxUser} shared max URLs (${maxValue})`
                      : null}
                  </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={!authenticated && tweetList.length === 0}
                    onClick={findTopDomain}
                  >
                    Top Domains Shared
                  </Button>
                  <Typography variant="h6" align="center" color="textSecondary">
                    {maxHostname
                      ? `${maxHostname} is the most shared URL`
                      : null}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        {isLoading ? (
          <div>
            <Typography align="center">
              <CircularProgress
                className={(classes.marginAutoItem, classes.large)}
                color="secondary"
              />
            </Typography>
            <Typography align="center" variant="subtitle1">
              Loading your Tweets
            </Typography>
          </div>
        ) : null}
        <Typography align="center" color="textPrimary" variant="h6" disabled>
          {tweetList.length > 0
            ? `Twiiter API returned ${tweetList.length} Tweets having URLs from your Timeline (Limit: Max 200)`
            : null}
        </Typography>
        <br />
        <br />

        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {tweetList.length > 0
              ? tweetList.map((tweet, idx) => (
                  <Grid item key={idx} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={tweet.user.profile_background_image_url_https}
                        title="Background Image"
                      />
                      <CardHeader
                        avatar={
                          <Avatar
                            alt="Profile Image"
                            src={tweet.user.profile_image_url_https}
                          />
                        }
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {tweet.user.screen_name}
                        </Typography>
                        <Typography>{tweet.text}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          href={tweet.user.url}
                        >
                          {tweet.user.screen_name}
                        </Button>
                        <Button size="small" color="secondary">
                          ReTweet : {tweet.retweet_count}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              : null}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          Twitter Dashboard by Tarun.
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Source Code on GitHub.
        </Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
