import React from 'react';
import {shallow, mount} from 'enzyme';
import {QuestionPage} from '../components/question-page';

describe('QuestionPage Test', () => {
  it('Smoke Test', () => {
    const vocabWords = {};
    const score = 0;
    const numSeenWords = 0;
    const lastAnswer = null;
    const previousWord = null;
    const currentUser = 'bob';
    shallow(<QuestionPage vocabWords={vocabWords} score={score} 
      numSeenWords={numSeenWords} lastAnswer={lastAnswer} previousWord={previousWord} currentUser={currentUser}/>);
  });

  it('has 3 div when lastAnswer is not false, 1 form, 1 ul, 1 li, 1 input, 1 button', () => {
    const vocabWords = {};
    const score = 0;
    const numSeenWords = 0;
    const lastAnswer = null;
    const previousWord = null;
    const currentUser = 'bob';
    const wrapper = shallow(<QuestionPage vocabWords={vocabWords} score={score} 
      numSeenWords={numSeenWords} lastAnswer={lastAnswer} previousWord={previousWord} currentUser={currentUser}/>);
    expect(wrapper.find('div').length).toEqual(3);
    expect(wrapper.find('form').length).toEqual(1);
    expect(wrapper.find('ul').length).toEqual(1);
    expect(wrapper.find('li').length).toEqual(1);
    expect(wrapper.find('input').length).toEqual(1);
    expect(wrapper.find('button').length).toEqual(1);
    expect(wrapper.find('li').text()).toEqual("");
  });

  it('has 4 div when lastAnswer is false', () => {
    const vocabWords = {};
    const score = 0;
    const numSeenWords = 0;
    const lastAnswer = false;
    const previousWord = {turkWord:'su', engWord:'water'};
    const currentUser = 'bob';
    const wrapper = shallow(<QuestionPage vocabWords={vocabWords} score={score} 
      numSeenWords={numSeenWords} lastAnswer={lastAnswer} previousWord={previousWord} currentUser={currentUser}/>);
    expect(wrapper.find('div').length).toEqual(4);
  });

  it('has turkish text in li if head is not null', () => {
    const vocabWords = {head:{turkWord:'su', engWord:'water'}};
    const score = 0;
    const numSeenWords = 0;
    const lastAnswer = null;
    const previousWord = null;
    const currentUser = 'bob';
    const wrapper = shallow(<QuestionPage vocabWords={vocabWords} score={score} 
      numSeenWords={numSeenWords} lastAnswer={lastAnswer} previousWord={previousWord} currentUser={currentUser}/>);
    expect(wrapper.find('li').text()).toEqual('su');
  });

  it('should dispatch answerQuestion when submit form', () => {
    const vocabWords = {head:{turkWord:'su', engWord:'water'}};
    const score = 0;
    const numSeenWords = 0;
    const lastAnswer = true;
    const previousWord = {turkWord:'kahve', engWord:'coffee'};
    const currentUser = 'bob';
    const dispatch = jest.fn();
    const wrapper = mount(<QuestionPage vocabWords={vocabWords} score={score} 
      numSeenWords={numSeenWords} lastAnswer={lastAnswer} previousWord={previousWord} currentUser={currentUser} dispatch={dispatch}/>);
    const form = wrapper.find('form');
    wrapper.simulate('submit');
    expect(dispatch).toHaveBeenCalled();
    expect(dispatch.mock.calls.length).toEqual(1);
  });
});