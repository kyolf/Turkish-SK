'use strict';

const mongoose = require('mongoose');

const vocabSchema = mongoose.Schema({
  turkWord:{type:String, required:true},
  engWord:{type:String, required:true},
  questId:{type:Number, required:true}
});

const Vocab = mongoose.model('Vocab', vocabSchema);

module.exports = {Vocab};