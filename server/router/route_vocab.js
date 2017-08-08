'use strict';

const express = require('express');
const vocabRouter = express.Router();
const {Vocab} = require('../models/models_vocab.js');

module.exports = {vocabRouter};