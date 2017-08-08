'use strict';

const express = require('express');
const userRouter = express.Router();
const {User} = require('../models/model_user.js');

userRouter.get('/api/users', (req,res) => {
  User
  .find()
  .exec()
  .then(users => res.json(users.map(user => user.apiRepr())));
});

module.exports = {userRouter};