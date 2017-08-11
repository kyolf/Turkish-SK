import * as Cookies from 'js-cookie';
import LinkedList from '../linkedList';

//Get the current Info of the User
export const FETCH_ME_REQUEST = 'FETCH_ME_REQUEST';
export const fetchMeRequest = () => ({
  type: FETCH_ME_REQUEST
});

export const FETCH_ME_SUCCESS = 'FETCH_ME_SUCCESS';
export const fetchMeSuccess = (currentUser) => ({
  type: FETCH_ME_SUCCESS,
  currentUser
});

export const FETCH_ME_ERROR = 'FETCH_ME_ERROR';
export const fetchMeError = (error) => ({
  type: FETCH_ME_ERROR,
  error
});

//Gets the Info of current user from the database
//If Unauthorized clear the cookie and prevent info retrieval
export const FETCH_ME = 'FETCH_ME';
export const fetchMe = (accessToken) => dispatch => {
  dispatch(fetchMeRequest());
  return fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('accessToken');
        return;
      }
      Promise.reject(response.statusText);
    }
    return response.json();
  })
  .then(currentUser => {
    return dispatch(fetchMeSuccess(currentUser));
  })
  .catch(err => {
    return dispatch(fetchMeError(err));
  })
}

//grabs the vocab words from the database
export const FETCH_VOCAB_REQUEST = 'FETCH_VOCAB_REQUEST';
export const fetchVocabRequest = ()=>({
  type: FETCH_VOCAB_REQUEST
});

export const FETCH_VOCAB_SUCCESS = 'FETCH_VOCAB_SUCCESS';
export const fetchVocabSuccess = (vocabWords, score, numSeenWords)=>({
  type: FETCH_VOCAB_SUCCESS,
  vocabWords,
  score,
  numSeenWords
});

export const FETCH_VOCAB_ERROR = 'FETCH_VOCAB_ERROR';
export const fetchVocabError = (error)=>({
  type: FETCH_VOCAB_ERROR,
  error
});

//If unauthorized, remove the cookie
//Checks if the current user ever started the quiz
//if the current user has, grab the list from where the user left off at
//if the current user hasn't, make a list from the vocabs in the database
export const FETCH_VOCAB = 'FETCH_VOCAB';
export const fetchVocab = (accessToken) => dispatch => {
  const newList = new LinkedList();
  dispatch(fetchMeRequest());
  return fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('accessToken');
        return;
      }
      Promise.reject(response.statusText);
    }
    return response.json();
  })
  .then(currentUser => {
    const tracker = currentUser.questTracker;
    if(tracker.length !== 0 ){
      newList.insertAll(tracker);
      return dispatch(fetchVocabSuccess(newList, currentUser.numCorrect, currentUser.numQuestAns));
    }
    return fetch('/api/vocab/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          Cookies.remove('accessToken');
          return;
        }
        Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(vocab => {
      newList.insertAll(vocab);
      return dispatch(fetchVocabSuccess(newList, 0, 0));
    })
    .catch(err => {
      return dispatch(fetchVocabError(err));
    })
  })
  // .then(response => {
  //   if (!response.ok) {
  //     Promise.reject(response.statusText);
  //   }
  //   return response.json();
  // })
  // .then(vocab => {
  //   console.log('these are the words being returned: ', vocab);
  //   newList.insertAll(vocab);
  //   return dispatch(fetchVocabSuccess(newList));
  // })
  .catch(err => {
    return dispatch(fetchMeError(err));
  })
}

//Reset the right or wrong feedback for the user
export const RESET_FEEDBACK = 'RESET_FEEDBACK';
export const resetFeedBack = () => ({
  type: RESET_FEEDBACK 
});

//Answering the question
export const ANSWER_QUESTION_REQUEST = 'ANSWER_QUESTION_REQUEST';
export const answerQuestionRequest = () => ({
  type:ANSWER_QUESTION_REQUEST
});

export const ANSWER_QUESTION_SUCCESS = 'ANSWER_QUESTION_SUCCESS';
export const answerQuestionSuccess = (numCorrect, numQuestAns, questTracker, lastAnswer, previousWord) => ({
  type:ANSWER_QUESTION_SUCCESS,
  numCorrect,
  numQuestAns,
  questTracker,
  lastAnswer,
  previousWord
});

export const ANSWER_QUESTION_ERROR = 'ANSWER_QUESTION_ERROR';
export const answerQuestionError = (error) => ({
  type: ANSWER_QUESTION_ERROR,
  error
});

//Sends the data to the backend for the correct or wrong logic
//Updates the state with the data that gets sent back
export const ANSWER_QUESTION = 'ANSWER_QUESTION';
export const answerQuestion = (userInput, vocabWords, currentUser, numCorrect, numQuestAns, accessToken) => dispatch => {
  const node = vocabWords.delete();
  const correctAns = {
    turkWord: node.turkWord,
    engWord: node.engWord,
    questId: node.questId,
    weight: node.weight || 1
  }
  const newArr = vocabWords.deleteAll();
  const updObj = {
    googleId: currentUser.googleId,
    correctAns,
    userInput,
    numCorrect,
    numQuestAns,
    questTracker: newArr
  }
  dispatch(answerQuestionRequest());
  fetch('/api/users/checkAnswer', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updObj)    
  })
  .then(response=>{
    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove('accessToken');
        return;
      }
      Promise.reject(response.statusText);
    }
    return response.json();    
  })
  .then(userInfo=>{
    const llist = new LinkedList();
    llist.insertAll(userInfo.questTracker);
    return dispatch(answerQuestionSuccess(userInfo.numCorrect, userInfo.numQuestAns, llist, userInfo.lastAnswer, userInfo.previousWord));
  })
  .catch(error=>{
    return dispatch(answerQuestionError(error));
  })
}
