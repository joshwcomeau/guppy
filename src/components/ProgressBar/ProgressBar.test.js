/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow, mount } from 'enzyme';
import ProgressBar, { Wrapper } from './ProgressBar';

describe('ProgressBar component', () => {
  describe('should render', () => {
    // We could do the tests in a loop but for three test cases
    // it's OK to duplicate code
    it('with 0%', () => {
      const wrapper = shallow(<ProgressBar progress={0} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('with 50%', () => {
      const wrapper = shallow(<ProgressBar progress={0.5} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('with 100%', () => {
      const wrapper = shallow(<ProgressBar progress={1.0} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should apply height style to Wrapper', () => {
    const wrapper = mount(<ProgressBar height={10} progress={0.5} />);

    expect(wrapper.find(Wrapper)).toHaveStyleRule('height', '10px');
  });
});
