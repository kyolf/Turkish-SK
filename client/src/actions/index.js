import * as Cookies from 'js-cookie';
import LinkedList from '../linkedList';


//GET Me
export const FETCH_ME_REQUEST = 'FETCH_ME_REQUEST';
export const fetchMeRequest = ()=>({
  type: FETCH_ME_REQUEST
});

export const FETCH_ME_SUCCESS = 'FETCH_ME_SUCCESS';
export const fetchMeSuccess = (currentUser)=>({
  type: FETCH_ME_SUCCESS,
  currentUser
});

export const FETCH_ME_ERROR = 'FETCH_ME_ERROR';
export const fetchMeError = (error)=>({
  type: FETCH_ME_ERROR,
  error
});

export const FETCH_ME = 'FETCH_ME';
export const fetchMe = (accessToken)=>dispatch=>{
  dispatch(fetchMeRequest())
  return fetch('/api/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }}).then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              // Unauthorized, clear the cookie and go to
              // the login page
              Cookies.remove('accessToken');
              return;
            }
            Promise.reject(response.statusText);
          }
          return response.json();
        }).then(currentUser => {
            return dispatch(fetchMeSuccess(currentUser));
            })
        .catch(err => {
            console.log(err);
            dispatch(fetchMeError(err));
        })
}

//GET vocab words
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

export const FETCH_VOCAB = 'FETCH_VOCAB';
export const fetchVocab = (accessToken)=>dispatch=>{
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
        // Unauthorized, clear the cookie and go to
        // the login page
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
          // Unauthorized, clear the cookie and go to
          // the login page
          Cookies.remove('accessToken');
          return;
        }
        Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(vocab => {
      console.log('these are the words being returned: ', vocab);
      newList.insertAll(vocab);
      return dispatch(fetchVocabSuccess(newList, 0, 0));
    })
    .catch(err => {
      console.log(err);
      dispatch(fetchVocabError(err));
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
    console.log(err);
    dispatch(fetchMeError(err));
  })
}

export const INCREMENT_NUM_SEEN = 'INCREMENT_NUM_SEEN';
export const incrementNumSeen = (numSeenWords)=>({
  type: INCREMENT_NUM_SEEN,
  numSeenWords
})

export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const incrementScore = ()=>({
  type: INCREMENT_SCORE
})

export const INCREMENT_NUM_QUEST = 'INCREMENT_NUM_QUEST';
export const incrementNumQuest = ()=>({
  type:INCREMENT_NUM_QUEST
})

export const RESET_FEEDBACK = 'RESET_FEEDBACK';
export const resetFeedBack = ()=>({
  type: RESET_FEEDBACK 
});

export const ANSWER_QUESTION_REQUEST = 'ANSWER_QUESTION_REQUEST';
export const answerQuestionRequest = ()=>({
  type:ANSWER_QUESTION_REQUEST
});

export const ANSWER_QUESTION_SUCCESS = 'ANSWER_QUESTION_SUCCESS';
export const answerQuestionSuccess = (numCorrect, numQuestAns, questTracker, lastAnswer, previousWord)=>({
  type:ANSWER_QUESTION_SUCCESS,
  numCorrect,
  numQuestAns,
  questTracker,
  lastAnswer,
  previousWord
});

export const ANSWER_QUESTION_ERROR = 'ANSWER_QUESTION_ERROR';
export const answerQuestionError = (error) =>({
  type: ANSWER_QUESTION_ERROR,
  error
});

export const ANSWER_QUESTION = 'ANSWER_QUESTION';
export const answerQuestion = (userInput, vocabWords, currentUser, numCorrect, numQuestAns, accessToken)=>dispatch=>{
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
        // Unauthorized, clear the cookie and go to
        // the login page
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

//UNused and UNneeded
//GET Google login
export const FETCH_LOGIN_REQUEST = 'FETCH_LOGIN_REQUEST';
export const fetchLoginRequest = ()=>({
  type: FETCH_LOGIN_REQUEST
});

export const FETCH_LOGIN_SUCCESS = 'FETCH_LOGIN_SUCCESS';
export const fetchLoginSuccess = ()=>({
  type: FETCH_LOGIN_SUCCESS,
});

export const FETCH_LOGIN_ERROR = 'FETCH_LOGIN_ERROR';
export const fetchLoginError = (error)=>({
  type: FETCH_LOGIN_ERROR,
  error
});

export const FETCH_LOGIN = 'FETCH_LOGIN';
export const fetchLogin = ()=>dispatch=>{
    dispatch(fetchLoginRequest());
    return fetch('/api/auth/google')
        .then(response => {
            if (!response.ok) {
                Promise.reject(response.statusText);
            }
            return response.json();
        }).then(login => {
            console.log(login);
            return dispatch(fetchLoginSuccess());
          })
        .catch(err => {
            console.log(err);
            return dispatch(fetchLoginError(err));
        })
}