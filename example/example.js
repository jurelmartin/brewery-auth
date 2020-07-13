require('dotenv').config();
const express = require('express');
const app = express();
const auth = require('../index')
const session = require('express-session');

const port = process.env.PORT || 3030;


const config = {
    host: process.env.HOST,
    realm: process.env.REALM,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    authorizationURL: process.env.AUTH_URL,
    tokenURL: process.env.TOKEN_URL,
    userInfoURL: process.env.USERINFO_URL
}
const breweryAuth = new auth(config);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

// app.use(breweryAuth.initialize())
app.get('/secured', breweryAuth.authenticate(), (req, res, next) => {
    const result = {
        authData: req.session.authData
    }
    res.status(200).json(result)
})

app.get('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
})

app.listen(port, ()=>{
    console.log(`app is listening on port ${port}`);
})