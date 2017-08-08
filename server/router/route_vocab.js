'use strict';

const express = require('express');
const vocabRouter = express.Router();
const {Vocab} = require('../models/model_vocab.js');

module.exports = {vocabRouter};