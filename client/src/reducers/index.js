import * as actions from '../actions'

const initialState = {
  currentUser: null,
  vocabWords: [],
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
      case actions.FETCH_LOGIN_REQUEST:
        return Object.assign({}, state, {loading: true});
      case actions.FETCH_LOGIN_SUCCESS:
        return Object.assign({}, state, {loggedIn: true, loading: false});
      case actions.FETCH_LOGIN_ERROR:
        return Object.assign({}, state, {error: action.error, loggedIn: false, loading: false});
      default:
        return state;
    }
}