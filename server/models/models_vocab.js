'use strict';

const mongoose = require('mongoose');

const vocabSchema = mongoose.Schema({
  turkWord:{type:String, required:true},
  engWord:{type:String, required:true},
  questId:{type:Number, required:true}
});

vocabSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    turkWord: this.turkWord,
    engWord: this.engWord,
    questId: this.questId
  };
};

const Vocab = mongoose.model('Vocab', vocabSchema);

module.exports = {Vocab};