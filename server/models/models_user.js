'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId:{type:String, required:true},
  accessToken:{type:String, required:true},
  numCorrect:{type:Number, required:true},
  numQuestAns:{type:Number, required:true},
  questIncorrect:[{type:Number}],
  questId:{type:Number, required:true}
});

userSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    googleId: this.googleId,
    accessToken: this.accessToken,
    numCorrect: this.numCorrect,
    numQuestAns: this.numQuestAns,
    questIncorrect: this.questIncorrect,
    questId: this.questId
  };
};

const User = mongoose.model('User', userSchema);
module.exports = {User};