import * as actions from '../actions'
import LinkedList from '../linkedList';

const initialState = {
  currentUser: null,
  vocabWords: new LinkedList(),
  currentWord: 0,
  score: 0,
  numSeenWords: 0,
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
        return Object.assign({}, state, {vocabWords: action.vocabWords, loading: false});
      case actions.FETCH_VOCAB_ERROR:
        return Object.assign({}, state, {error: action.error, loading: false});
      case actions.INCREMENT_NUM_SEEN:
        return Object.assign({}, state, {numSeenWords: ++action.numSeenWords, loggedIn: true, loading:false});
      case actions.INCREMENT_SCORE:
        return Object.assign({}, state, {score: ++state.score, loggedIn: true, loading: false});
      case actions.SUBMIT_ANSWER:
        const node = action.vocabWords.delete();
        if( action.userAnswer === node.engWord){
          console.log('correct answer');
          let toInsert = action.vocabWords.head;
          let count = node.weight*2;
          while(toInsert.next !== null && count > 0){
            toInsert = toInsert.next;
            count--;
          }
          action.vocabWords.insert(toInsert, node.turkWord, node.engWord, node.questId, node.weight*2);
          return Object.assign({}, state, {
            vocabWords: action.vocabWords,
            score: ++state.score,
            numSeenWords: ++state.numSeenWords,
            loading: false
          });
        }
        else{
          console.log('incorrect answer');
          action.vocabWords.insert(action.vocabWords.head.next, node.turkWord, node.engWord, node.questId, 1);
          return Object.assign({}, state, {
            vocabWords: action.vocabWords,
            numSeenWords: ++state.numSeenWords,
            loading: false
          });
        }
      // case actions.INCREMENT_NUM_QUEST:
      //   return Object.assign({}, state, {: ++state.numSeenWords, loggedIn: true, loading: false});
      default:
        return state;
    }
}