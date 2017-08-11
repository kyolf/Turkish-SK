'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId:{type:String, required:true},
  accessToken:{type:String, required:true},
  numCorrect:{type:Number, required:true},
  numQuestAns:{type:Number, required:true},
  questTracker:[{turkWord:String, engWord:String, questId:Number, weight:Number}],
});

userSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    googleId: this.googleId,
    accessToken: this.accessToken,
    numCorrect: this.numCorrect,
    numQuestAns: this.numQuestAns,
    questTracker: this.questTracker
  };
};

const User = mongoose.model('User', userSchema);
module.exports = {User};