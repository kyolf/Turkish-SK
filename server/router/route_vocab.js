'use strict';

const express = require('express');
const vocabRouter = express.Router();
const {Vocab} = require('../models/models_vocab.js');

vocabRouter.get('/', (req,res)=>{
  Vocab
  .find()
  .exec()
  .then(users => res.json(users.map(el => el.apiRepr())));
});

//For Admin Use Only
vocabRouter.post('/', (req,res)=>{
  const requiredFields = ['turkWord', 'engWord', 'questId'];
  const createObj = {};
  let message;

  requiredFields.forEach(field => {
    if(!(field in req.body)){
      message = `${field} is not located in req.body`;
      return res.status(400).json({message});
    }
    createObj[field] = req.body[field];
  });

  if(typeof createObj.turkWord !== String){
    message = 'Turkish Word input is not a string';
    return res.status(422).json({message});
  }

  if(typeof createObj.engWord !== String){
    message = 'English Word input is not a string';
    return res.status(422).json({message});
  }

  if(typeof createObj.questId !== Number){
    message = 'Question Id is not a number';
    return res.status(422).json({message});
  }

  Vocab
  .findOne({questId:createObj.questId})
  .exec()
  .then(vocab => {
    if(vocab){
      message = 'Question Id already exists';
      return res.status(422).json({message});
    }

    Vocab
    .create(createObj)
    .exec()
    .then(vocab => {
      return res.status(201).json(vocab.apiRepr());
    })
    .catch(err => {
      message = `Internal Server Post Vocab Error ${err}`;
      return res.status(500).json({message});
    });
  })
  .catch(err => {
    message = `Internal Server Find Exist Question Id Error: ${err}`;
    return res.status(500).json({message});
  });

});



module.exports = {vocabRouter};