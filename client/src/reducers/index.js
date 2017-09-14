import * as actions from '../actions'
import LinkedList from '../linkedList';

const initialState = {
  currentUser: null,
  vocabWords: new LinkedList(),
  previousWord: null,
  currentWord: 0,
  score: 0,
  numSeenWords: 0,
  lastAnswer: null,
  numQuest: 0,
  loggedIn: false,
  loading: false,
  error: null,
}

export const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.FETCH_ME_REQUEST:
      return Object.assign({}, state, {loading: true});
    case actions.FETCH_ME_SUCCESS:
      return Object.assign({}, state, {currentUser: action.currentUser, loading: false});
    case actions.FETCH_ME_ERROR:
      return Object.assign({}, state, {error: action.error, loading: false});
    case actions.FETCH_VOCAB_REQUEST:
      return Object.assign({}, state, {loading: true});
    case actions.FETCH_VOCAB_SUCCESS:
      return Object.assign({}, state, {vocabWords: action.vocabWords, score: action.score, numSeenWords: action.numSeenWords, loading: false});
    case actions.FETCH_VOCAB_ERROR:
      return Object.assign({}, state, {error: action.error, loading: false});
    case actions.RESET_FEEDBACK:
      return Object.assign({}, state, {lastAnswer:null});
    case actions.ANSWER_QUESTION_REQUEST:
      return Object.assign({}, state, {loading: true});
    case actions.ANSWER_QUESTION_SUCCESS:
      return Object.assign({}, state, {score: action.numCorrect, numSeenWords: action.numQuestAns, 
        vocabWords: action.questTracker, lastAnswer: action.lastAnswer, previousWord: action.previousWord});
    case actions.ANSWER_QUESTION_ERROR:
      return Object.assign({}, state, {error: action.error, loading: false});
    default:
      return state;
  }
}