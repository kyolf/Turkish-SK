import {reducer} from '../reducers';
import * as actions from '../actions';

describe('Reducer', () => {
  it('should set the initial state', ()=>{
    const state = reducer(undefined, {type: 'UNKNOWN'});
    expect(state.currentUser).toEqual(null);
    expect(state.previousWord).toEqual(null);
    expect(state.currentWord).toEqual(0);
    expect(state.score).toEqual(0);
    expect(state.numSeenWords).toEqual(0);
    expect(state.numQuest).toEqual(0);
    expect(state.lastAnswer).toEqual(null);
    expect(state.loggedIn).toEqual(false);
    expect(state.error).toEqual(null);
    expect(state.loading).toEqual(false);
  });

  it('should change loading to true when action is fetch me request', () => {
    const state = reducer(undefined, actions.fetchMeRequest());
    expect(state.currentUser).toEqual(null);
    expect(state.previousWord).toEqual(null);
    expect(state.currentWord).toEqual(0);
    expect(state.score).toEqual(0);
    expect(state.numSeenWords).toEqual(0);
    expect(state.numQuest).toEqual(0);
    expect(state.lastAnswer).toEqual(null);
    expect(state.loggedIn).toEqual(false);
    expect(state.error).toEqual(null);
    expect(state.loading).toEqual(true);
  });

  it('should change loading and currentUser when action is fetch me success', () => {
    let initState = {
      loading: true,
      currentUser: null
    };

    const newState = reducer(initState, actions.fetchMeSuccess('bob'));
    expect(newState.currentUser).toEqual('bob');
    expect(newState.loading).toEqual(false);
  });

  it('should change loading and error when action is fetch me error', () => {
    let initState = {
      loading: true,
      error: null
    };

    const newState = reducer(initState, actions.fetchMeError('bad'));
    expect(newState.error).toEqual('bad');
    expect(newState.loading).toEqual(false);
  });

  it('should change loading when action is fetch vocab request', () => {
    const newState = reducer(undefined, actions.fetchVocabRequest());
    expect(newState.loading).toEqual(true);
  });
  
  it('should change loading, vocabWords, score, and numSeenWords when action is fetch vocab success', () => {
    const vocabWords = {head:{turkWord:'su', engWord:'water', next:null}};
    const score = 1;
    const numSeenWords = 2;

    const newState = reducer(undefined, actions.fetchVocabSuccess(vocabWords, score, numSeenWords));
    expect(newState.loading).toEqual(false);
    expect(newState.vocabWords).toEqual(vocabWords);
    expect(newState.score).toEqual(score);
    expect(numSeenWords).toEqual(2);
  });

  it('should change loading and error when action is fetch vocab error', () => {
    let initState = {
      loading: true,
      error: null
    };

    const newState = reducer(initState, actions.fetchVocabError('bad'));
    expect(newState.error).toEqual('bad');
    expect(newState.loading).toEqual(false);
  });

  it('should change lastAnswer when action is reset feedback', () => {
    const newState = reducer(undefined, actions.resetFeedBack());
    expect(newState.lastAnswer).toEqual(null);
  });


  it('should change loading when action is answer question request', () => {
    const newState = reducer(undefined, actions.answerQuestionRequest());
    expect(newState.loading).toEqual(true);
  });

  it('should change loading,score, numSeenWords, vocabWords, lastAnswer, and previousWord when action is answer question success', () => {
    const score = 1;
    const numSeenWords = 2;
    const vocabWords = {head:{turkWord:'su', engWord:'water', next:null}};
    const lastAnswer = false;
    const previousWord = {turkWord:'kahve', engWord:'coffee'};
    
    const newState = reducer(undefined, actions.answerQuestionSuccess(score, numSeenWords, vocabWords, lastAnswer, previousWord));
    expect(newState.loading).toEqual(false);
    expect(newState.score).toEqual(score);
    expect(newState.numSeenWords).toEqual(numSeenWords);
    expect(newState.vocabWords).toEqual(vocabWords);
    expect(newState.lastAnswer).toEqual(lastAnswer);
    expect(newState.previousWord).toEqual(previousWord);
  });

  it('should change loading and error when action is answer question error', () => {
    let initState = {
      loading: true,
      error: null
    };

    const newState = reducer(initState, actions.answerQuestionError('bad'));
    expect(newState.error).toEqual('bad');
    expect(newState.loading).toEqual(false);
  });
});