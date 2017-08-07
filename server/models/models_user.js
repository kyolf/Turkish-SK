'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId:{type:String, required:true},
  accessToken:{type:String, required:true},
  numCorrect:{type:Number, required:true},
  numQuestAns:{type:Number, required:true},
  questId:{type:Number, required:true}
});

userSchema.virtual('percentCor').get(function(){
  if(this.numQuestAns <= 0){
    return 'Haven\'t taken quiz';
  }
  return `${(this.numCorrect/this.numQuestAns).toFixed(2)}%`.substring(2);
});

userSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    googleId: this.googleId,
    accessToken:this.accessToken,
    percentCor: this.percentCor,
    questId:this.questId
  };
};

const User = mongoose.model('User', userSchema);
module.exports = {User};