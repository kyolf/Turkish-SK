import React from 'react';
import {shallow} from 'enzyme';
import LoginPage from '../components/login-page';

describe('Login Test', () => {
  it('Smoke Test', () => {
    shallow(<LoginPage />);
  });

  it('has a div, an anchor element, and a button', () => {
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.find('div').length).toEqual(1);
    expect(wrapper.find('a').length).toEqual(1);
    expect(wrapper.find('button').length).toEqual(1);
  });
});