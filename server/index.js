'use strict';
const path = require('path');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const {User} = require('./models/models_user.js');

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
};

if(process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const app = express();

app.use(passport.initialize());

passport.use(
  new GoogleStrategy({
    clientID:  secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    let message;
    const newUser = {
      googleId: profile.id,
      accessToken,
      numCorrect: 0,
      numQuestAns: 0,
      questId: 0
    };

    User
    .findOne({googleId:profile.id}, (err, user) => {
      if(err){
        message = `Finding a user in database error: ${err}`;
        return cb(err, {message});
      }
      return user;
    })
    .then(result=>{
      if(result){
        User.findOneAndUpdate({googleId:profile.id}, {$set:{accessToken}}, {new:true}, (err, doc) => {
          if(err){
            message = `Updating a user in database error: ${err}`;
            return cb(err, {message});
          }
          return cb(err, doc);
        });
      }
      else{
        User.create(newUser, (err, user) => {
          if(err){
            message = `Creating a user in database error: ${err}`;
            return cb(err, {message});
          }
          return cb(err, user);
        });
      }
    });
  }
));

passport.use(
  new BearerStrategy(
    (token, done) => {
      User
      .findOne({accessToken:token})
      .exec()
      .then(user =>{
        if(!user){
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

app.get('/api/auth/google',
  passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    res.cookie('accessToken', req.user.accessToken, {expires: 0});
    res.redirect('/');
  }
);

app.get('/api/auth/logout', (req, res) => {
  req.logout();
  res.clearCookie('accessToken');
  res.redirect('/');
});

app.get('/api/me',
  passport.authenticate('bearer', {session: false}),
  (req, res) => res.json({
    googleId: req.user.googleId
  })
);

app.get('/api/questions',
  passport.authenticate('bearer', {session: false}),
  (req, res) => res.json(['Question 1', 'Question 2'])
);

app.get('/api/users', (req,res) => {
  User
  .find()
  .exec()
  .then(users => res.json(users.map(user => user.apiRepr())));
});
// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, '../client/build', 'index.html');
  res.sendFile(index);
});

let server;
function runServer(port=3001, databaseUrl = secret.DATABASE_URL) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if(err) {
        reject(err);
      }
      server = app.listen(port, () => {
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer();
}

module.exports = {
  app, runServer, closeServer
};
