import React from 'react';
import {shallow} from 'enzyme';
import Header from '../components/header';

describe('Header Testing', () => {
  it('Smoke Test', () => {
    shallow(<Header />)
  });

  it('has a div, a h1, a h3, and a logout button', () => {
    const wrapper = shallow(<Header currentUser={'bob'}/>);
    expect(wrapper.find('div').length).toEqual(1);
    expect(wrapper.find('h1').length).toEqual(1);
    expect(wrapper.find('h3').length).toEqual(1);
    
    const logout = wrapper.find('button');
    expect(logout.length).toEqual(1);
    expect(logout.text()).toEqual('Logout');
    
  });

  it('has a login button when there are no user', () => {
    const wrapper = shallow(<Header/>);
    const login = wrapper.find('button');
    expect(login.length).toEqual(1);
    expect(login.text()).toEqual('Login with Google');
  });
});