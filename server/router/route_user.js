'use strict';

const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const {User} = require('../models/models_user.js');

userRouter.get('/', (req,res) => {
  User
  .find()
  .exec()
  .then(users => res.json(users.map(user => user.apiRepr())));
});

userRouter.get('/me',
  passport.authenticate('bearer', {session: false}), 
  (req,res)=>{
    const userObj = {
      googleId: req.user.googleId,
      accessToken: req.user.accessToken,
      numCorrect: req.user.numCorrect,
      numQuestAns: req.user.numQuestAns,
      questId: req.user.questId,
      questIncorrect: req.user.questIncorrect
    };
    res.json(userObj);
  });

userRouter.put('/:googleId',
  passport.authenticate('bearer', {session: false}), 
  (req,res)=>{
    const requiredFields = [];
  });

module.exports = {userRouter};