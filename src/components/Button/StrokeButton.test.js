/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';
import DetectActive from '../DetectActive';
import StrokeButton, { Foreground, Background } from './StrokeButton';

describe('StrokeButton component', () => {
  let wrapper;
  let renderProp;
  beforeEach(() => {
    wrapper = mount(<StrokeButton />);
    renderProp = wrapper.find(DetectActive).renderProp('children');
  });

  it('should render foreground (inactive)', () => {
    expect(renderProp(false).find(Foreground)).toMatchSnapshot();
  });
  it('should render background (inactive)', () => {
    expect(renderProp(false).find(Background)).toMatchSnapshot();
  });

  it('should render foreground (active)', () => {
    expect(renderProp(true).find(Foreground)).toMatchSnapshot();
  });
  it('should render background (active)', () => {
    expect(renderProp(true).find(Background)).toMatchSnapshot();
  });
});
