/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import ButtonWithIcon, { InnerWrapper } from './ButtonWithIcon';

describe('ButtonWithIcon component', () => {
  it('should render button with icon', () => {
    // mock icon to reduce snapshot size
    const icon = <svg />;
    const wrapper = mount(<ButtonWithIcon icon={icon} />);
    // Snapshot of InnerWrapper is OK as StrokeButton is tested separately.
    expect(wrapper.find(InnerWrapper)).toMatchSnapshot();
  });
});
