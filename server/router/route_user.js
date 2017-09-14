'use strict';

const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const {User} = require('../models/models_user.js');

//gets all users
userRouter.get('/', (req, res) => {
  User
  .find()
  .exec()
  .then(users => res.json(users.map(user => user.apiRepr())));
});

//gets current user
userRouter.get('/me',
  passport.authenticate('bearer', {session: false}), 
  (req, res) => {
    const userObj = {
      googleId: req.user.googleId,
      accessToken: req.user.accessToken,
      numCorrect: req.user.numCorrect,
      numQuestAns: req.user.numQuestAns,
      questId: req.user.questId,
      questTracker: req.user.questTracker
    };
    res.json(userObj);
  });

//updates database based on the right and wrong logic
userRouter.put('/checkAnswer',
  passport.authenticate('bearer', {session: false}), 
  (req, res) => {
    const updObj = {};
    let message;
    
    if (req.body.googleId !== req.user.googleId) {
      message = `Body Google Id ${req.body.googleId} does not match User Id ${req.user.googleId}`;
      return res.status(400).json({message});
    }
    
    if (!req.body.correctAns) {
      message = 'correctAns is not in the body';
      return res.status(400).json({message});
    }

    if (!req.body.questTracker) {
      message = 'Quest Tracker is not in the body';
      return res.status(400).json({message});
    }

    if (!req.body.userInput && typeof req.body.userInput !== 'string') {
      message = 'Body userInput is null or undefined or not a string';
      return res.status(422).json({message});
    }

    if (req.body.numCorrect && typeof req.body.numCorrect !== 'number') {
      message = 'numCorrect is not a number';
      return res.status(422).json({message});
    }

    if (req.body.numQuestAns && typeof req.body.numQuestAns !== 'number') {
      message = 'numQuestAns is not a number';
      return res.status(422).json({message});
    }

    updObj.correctAns = req.body.correctAns;

    let lastAnswer;
    if (req.body.userInput !== req.body.correctAns.engWord) {
      updObj.numCorrect = req.body.numCorrect;
      updObj.correctAns.weight = 1;
      lastAnswer = false;
    }
    else {
      updObj.numCorrect = req.body.numCorrect + 1;
      updObj.correctAns.weight *= 2;
      lastAnswer = true;
    }

    updObj.numQuestAns = req.body.numQuestAns + 1;
    
    let newArr;
    const tracker = req.body.questTracker;
    if (req.body.correctAns.weight > tracker.length - 1) {
      newArr = [...req.body.questTracker.slice(0, tracker.length), updObj.correctAns];
    }
    else {
      newArr = [...req.body.questTracker.slice(0, req.body.correctAns.weight),
        updObj.correctAns, ...req.body.questTracker.slice(req.body.correctAns.weight)];
    }

    updObj.questTracker = newArr;

    if (updObj.questTracker) {
      updObj.questTracker.map(el => {
        if (typeof el.weight !== 'number') {
          message = 'Not every weight element in questTracker is a number';
          return res.status(422).json({message});
        }
        if (typeof el.questId !== 'number') {
          message = 'Not every QuestId element in questTracker is a number';
          return res.status(422).json({message});
        }
        if (typeof el.turkWord !== 'string') {
          message = 'Not every turkWord element in questTracker is a string';
          return res.status(422).json({message});
        }
        if (typeof el.engWord !== 'string') {
          message = 'Not every engWord element in questTracker is a string';
          return res.status(422).json({message});
        }

        return el;
      });
    }

    User
    .findOneAndUpdate({googleId: req.user.googleId}, {$set:updObj}, {new:true})
    .exec()
    .then(user => {
      const lastAnswerObj = user.apiRepr();
      lastAnswerObj.lastAnswer = lastAnswer;
      lastAnswerObj.previousWord = updObj.correctAns;
      return res.status(201).json(lastAnswerObj);
    })
    .catch(err => {
      message = `Internal Server Error User Put: ${err}`;
      return res.status(500).json({message});
    });
  });

//Page Not Found 
userRouter.use('*', (req, res) => {
  return res.status(404).json({message:'Page Not Found'});
}); 
 
module.exports = {userRouter};