/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import StrokeButton, { Background } from './StrokeButton';

describe('StrokeButton component', () => {
  it('should render button with stroke outline', () => {
    const wrapper = mount(<StrokeButton />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render background with active style', () => {
    const colors = StrokeButton.defaultProps.strokeColors;
    const background = mount(<Background isActive colors={colors} />);
    expect(background).toMatchSnapshot();
  });
});
