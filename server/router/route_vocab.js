'use strict';

const express = require('express');
const vocabRouter = express.Router();
const {Vocab} = require('../models/models_vocab.js');

//get all vocabs in database
vocabRouter.get('/', (req, res) => {
  Vocab
  .find()
  .exec()
  .then(users => res.json(users.map(el => el.apiRepr())));
});

//For Admin Use Only
//create vocab and add it to database
vocabRouter.post('/', (req, res) => {
  const requiredFields = ['turkWord', 'engWord', 'questId'];
  const createObj = {};
  let message;

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      message = `${field} is not located in req.body`;
      return res.status(400).json({message});
    }
    createObj[field] = req.body[field];
  });

  if (typeof createObj.turkWord !== 'string') {
    message = 'Turkish Word input is not a string';
    return res.status(422).json({message});
  }

  if (typeof createObj.engWord !== 'string') {
    message = 'English Word input is not a string';
    return res.status(422).json({message});
  }

  if (typeof createObj.questId !== 'number') {
    message = 'Question Id is not a number';
    return res.status(422).json({message});
  }

  Vocab
  .findOne({questId:createObj.questId})
  .exec()
  .then(vocab => {
    if (vocab) {
      message = 'Question Id already exists';
      return res.status(422).json({message});
    }

    Vocab
    .create(createObj)
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

//update vocab in database
vocabRouter.put('/:id', (req, res) => {
  const updateFields = ['turkWord', 'engWord'];
  const updObj = {};
  let message;

  if (req.params.id !== req.body.id) {
    message = `Params Id ${req.params.id} does not equal body id ${req.body.id}`;
    return res.status(400).json({message});
  }

  if (req.body.turkWord && typeof req.body.turkWord !== 'string') {
    message = 'Turkish Word is not a string';
    return res.status(400).json({message});
  }

  if (req.body.engWord && typeof req.body.engWord !== 'string') {
    message = 'English Word is not a string';
    return res.status(400).json({message});
  }

  updateFields.map(field => {
    if(field in req.body){
      updObj[field] = req.body[field];
    }
  });

  Vocab
  .findByIdAndUpdate(req.params.id, {$set: updObj}, {new:true})
  .exec()
  .then(vocab => {
    return res.status(201).json(vocab.apiRepr());
  })
  .catch(err => {
    message = `Internal Server Put Vocab Error: ${err}`;
    return res.status(500).json({message});
  });
});

//delete vocabs from database
vocabRouter.delete('/:id', (req, res) => {
  let message;

  Vocab.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => {
    return res.status(204).end();
  })
  .catch(err => {
    message = `Internal Server Delete Error ${err}`;
    return res.status(500).json({message});
  });
});

vocabRouter.use('*', (req, res) => {
  return res.status(404).json({message:'Page Not Found'});
});

module.exports = {vocabRouter};