import * as actions from '../actions';

describe('fetch me request', () => {
  it('should return the action', () => {
    const action = actions.fetchMeRequest();
    expect(action.type).toEqual(actions.FETCH_ME_REQUEST);
  });
});

describe('fetch me success', () => {
  it('should return the action', () => {
    const currentUser = 'bob';
    const action = actions.fetchMeSuccess(currentUser);
    expect(action.type).toEqual(actions.FETCH_ME_SUCCESS);
    expect(action.currentUser).toEqual(currentUser);
  });
});

describe('fetch me error', () => {
  it('should return the action', () => {
    const error = 'bad';
    const action = actions.fetchMeError(error);
    expect(action.type).toEqual(actions.FETCH_ME_ERROR);
    expect(action.error).toEqual(error);
  });
});

describe('fetch vocab request', () => {
  it('should return the action', () => {
    const action = actions.fetchVocabRequest();
    expect(action.type).toEqual(actions.FETCH_VOCAB_REQUEST);
  });
});

describe('fetch vocab success', () => {
  it('should return the action', () => {
    const vocabWords = {head:{engWord:'water', turkish:'su'}};
    const score = 1;
    const numSeenWords = 2;
    const action = actions.fetchVocabSuccess(vocabWords, score, numSeenWords);
    expect(action.type).toEqual(actions.FETCH_VOCAB_SUCCESS);
    expect(action.vocabWords).toEqual(vocabWords);
    expect(action.score).toEqual(score);
    expect(action.numSeenWords).toEqual(numSeenWords);
  });
});

describe('fetch vocab error', () => {
  it('should return the action', () => {
    const error = 'bad';
    const action = actions.fetchVocabError(error);
    expect(action.type).toEqual(actions.FETCH_VOCAB_ERROR);
    expect(action.error).toEqual(error);
  });
});

describe('reset feedback', () => {
  it('should return the action', () => {
    const action = actions.resetFeedBack();
    expect(action.type).toEqual(actions.RESET_FEEDBACK);
  });
});

describe('answer question request', () => {
  it('should return the action', () => {
    const action = actions.answerQuestionRequest();
    expect(action.type).toEqual(actions.ANSWER_QUESTION_REQUEST);
  });
});

describe('answer question success', () => {
  it('should return the action', () => {
    const numCorrect = 1;
    const numQuestAns = 1;
    const questTracker = 2;
    const lastAnswer = false;
    const previousWord = {turkWord:'su', engWord:'water'};
    const action = actions.answerQuestionSuccess(numCorrect, numQuestAns, questTracker, lastAnswer, previousWord);
    expect(action.type).toEqual(actions.ANSWER_QUESTION_SUCCESS);
    expect(action.numCorrect).toEqual(numCorrect);
    expect(action.numQuestAns).toEqual(numQuestAns);
    expect(action.questTracker).toEqual(questTracker);
    expect(action.lastAnswer).toEqual(lastAnswer);
    expect(action.previousWord).toEqual(previousWord);
  });
});

describe('answer question error', () => {
  it('should return the action', () => {
    const error = 'bad';
    const action = actions.answerQuestionError(error);
    expect(action.type).toEqual(actions.ANSWER_QUESTION_ERROR);
    expect(action.error).toEqual(error);
  });
});