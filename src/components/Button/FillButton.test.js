/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import FillButton, { wrapColorsInGradient } from './FillButton';

describe('FillButton component', () => {
  it('should render button filled', () => {
    const wrapper = mount(<FillButton />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Wrap colors in gradient', () => {
    const testColor = '#fff';
    it('should return single color (string)', () => {
      expect(wrapColorsInGradient(testColor)).toEqual(testColor);
    });
    it('should return single color (array)', () => {
      expect(wrapColorsInGradient([testColor])).toEqual(testColor);
    });

    it('should return a gradient', () => {
      const colors = [testColor, '#000'];
      expect(wrapColorsInGradient(colors)).toEqual(`linear-gradient(
    45deg,
    ${colors.join(',')}
  )`);
    });
  });
});
