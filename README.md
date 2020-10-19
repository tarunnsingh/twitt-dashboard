# Twitter Dashboard :ghost:
Picks up Tweets from your Home Timeline (Your Tweets + Your Friends Tweets). Also tells you which user shared the most tweets with urls, which urls were shared the most and also a list of tweets having only urls.

> ## :rocket: Deployed to Heroku.
> This repo has been enabled with automatic deployment via the master branch.

## :loudspeaker: See demo video below or check out [LIVE](https://twitt-dashboard.herokuapp.com/).
[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/iIkLQAKoVe0/0.jpg)](http://www.youtube.com/watch?v=iIkLQAKoVe0)

## Run it Locally :computer:
1. Set up Twitter Deeveloper account and Create an app. You will get the keys from the settings page.
2. Set up MongoDB Atlas and create MongoDB URI. (See [THIS](https://medium.com/swlh/creating-connecting-a-mongodb-database-and-node-js-server-to-a-front-end-6a53d400ae6a), if stuck).  
3. Create a `.env`. file and add the following code to it.  
```
TWITTER_CONSUMER_KEY=  
TWITTER_CONSUMER_SECRET=  
TWITTER_ACCESS_TOKEN=  
TWITTER_TOKEN_SECRET=  
MONGODB_URI=  
COOKIE_KEY=  
CLIENT_HOME_PAGE_URL=http://localhost:3000
```
> Cookie Key can be any random string and all keys should be placed without adding quotes and brackets.

4. Install dependincies for server by `npm install` in root folder.
5. Install dependencies for client by `cd client && npm install` from root folder.
6. Run server and client in separate terminals using `npm start`.
6. See `localhost:3000`.

## Built using :bookmark:
<img src="https://upload.wikimedia.org/wikipedia/commons/9/94/MERN-logo.png" width="500" />

## Thanks! :star:
