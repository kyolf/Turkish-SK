import React from 'react';
import {shallow} from 'enzyme';
import InfoPage from '../components/info-page';

describe('Login Test', () => {
  it('Smoke Test', () => {
    shallow(<InfoPage />);
  });

  it('has a div, a main, 3 section, 3 p, 3 h2, 3 img, and a h1 element', () => {
    const wrapper = shallow(<InfoPage />);
    expect(wrapper.find('div').length).toEqual(1);
    expect(wrapper.find('main').length).toEqual(1);
    expect(wrapper.find('h1').length).toEqual(1);
    expect(wrapper.find('section').length).toEqual(3);
    expect(wrapper.find('h2').length).toEqual(3);
    expect(wrapper.find('p').length).toEqual(3);
    expect(wrapper.find('img').length).toEqual(3);
  });
});