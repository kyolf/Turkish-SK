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
export const fetchVocabSuccess = (vocabWords)=>({
  type: FETCH_VOCAB_SUCCESS,
  vocabWords
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
    console.log('Current User', currentUser);
    const tracker = currentUser.questTracker;
    if(tracker.length !== 0 ){
      newList.insertAll(tracker);
      return dispatch(fetchVocabSuccess(newList));
    }
    return fetch('/api/vocab/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      Promise.reject(response.statusText);
    }
    return response.json();
  })
  .then(vocab => {
    console.log('these are the words being returned: ', vocab);
    newList.insertAll(vocab);
    return dispatch(fetchVocabSuccess(newList));
  })
  .catch(err => {
    console.log(err);
    dispatch(fetchVocabError(err));
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


export const SUBMIT_ANSWER = 'SUBMIT_ANSWER';
export const submitAnswer = (userAnswer, vocabWords)=> ({
  type : SUBMIT_ANSWER, 
  vocabWords,
  userAnswer
});


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
            dispatch(fetchLoginError(err));
        })
}