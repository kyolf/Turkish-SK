import React from 'react';
import {shallow, mount} from 'enzyme';
import {App} from '../components/app';
import QuestionPage from '../components/question-page'

describe('App Test', () => {
  it('Smoke Test', () => {
    shallow(<App />);
  });

  it('has 1 div and 1 header', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div').length).toEqual(1);
    expect(wrapper.find('Header').length).toEqual(1);
  });

  it('has a Login Page if there is no a current user', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('LoginPage').length).toEqual(1);
  });

  it('has a Question Page if there is a current user', () => {
    const currentUser = 'bob';
    const wrapper = shallow(<App currentUser={currentUser} />);
    expect(wrapper.find(QuestionPage).exists()).toEqual(true);
  });
});
