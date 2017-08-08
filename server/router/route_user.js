'use strict';

const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const {User} = require('../models/models_user.js');

userRouter.get('/', (req, res) => {
  User
  .find()
  .exec()
  .then(users => res.json(users.map(user => user.apiRepr())));
});

userRouter.get('/me',
  passport.authenticate('bearer', {session: false}), 
  (req, res)=>{
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

userRouter.put('/',
  passport.authenticate('bearer', {session: false}), 
  (req, res)=>{
    const updateFields = ['googleId', 'accessToken', 'numCorrect', 'numQuestAns', 'questIncorrect', 'questId'];
    const updObj = {};
    let message;
    
    if(req.body.googleId !== req.user.googleId){
      message = `Body Google Id ${req.body.googleId} does not match User Id ${req.user.googleId}`;
      return res.status(400).json({message});
    }

    if(req.body.numCorrect && typeof req.body.numCorrect !== 'number'){
      message = 'numCorrect is not a number';
      return res.status(422).json({message});
    }

    if(req.body.numQuestAns && typeof req.body.numQuestAns !== 'number'){
      message = 'numQuestAns is not a number';
      return res.status(422).json({message});
    }

    if(req.body.questId && typeof req.body.questId !== 'number'){
      message = 'questId is not a number';
      return res.status(422).json({message});
    }

    if(req.body.questIncorrect){
      req.body.questIncorrect.map(el => {
        if(typeof el !== 'number'){
          message = 'Not every element in questIncorrect is a number';
          return res.status(422).json({message});
        }
        return el;
      });
    }

    updateFields.map(field=>{
      if(field in req.body){
        updObj[field] = req.body[field];
      }
    });

    User
    .findOneAndUpdate({googleId: req.user.googleId}, {$set:updObj},{new:true})
    .exec()
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      message = `Internal Server Error User Put: ${err}`;
      return res.status(500).json({message});
    });
  });


userRouter.use('*', (req, res) => {
  return res.status(404).json({message:'Page Not Found'});
}); 
 
module.exports = {userRouter};