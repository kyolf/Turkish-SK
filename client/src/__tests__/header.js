import React from 'react';
import {shallow, mount} from 'enzyme';
import Header from '../components/header';

describe('Header Testing', () => {
  it('Smoke Test', () => {
    shallow(<Header />)
  });

  it('has a div, a h1, a h3, and a button', () => {
    const wrapper = shallow(<Header currentUser={'bob'}/>);
    expect(wrapper.find('div').length).toEqual(1);
    expect(wrapper.find('h1').length).toEqual(1);
    expect(wrapper.find('h3').length).toEqual(1);
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('has no button when there are no user', () => {
    const wrapper = shallow(<Header/>);
    expect(wrapper.find('button').length).toEqual(0);
  });
});