/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import BigClickableButton from './BigClickableButton';
// TODO: Use Lolex to mock setTimeout - later use Jest mock once PR https://github.com/facebook/jest/pull/5171 landed
import lolex from 'lolex';

describe('BigClickableButton component', () => {
  let wrapper;
  let button;
  lolex.install(); // mock setTimeout

  beforeEach(() => {
    wrapper = mount(<BigClickableButton />);
    button = wrapper.find('button');
    jest.clearAllTimers();
    button.simulate('mouseDown');
  });

  it('should render pressed', () => {
    expect(wrapper.state('isActive')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render released', () => {
    button.simulate('mouseUp');
    expect(wrapper.state('isActive')).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
