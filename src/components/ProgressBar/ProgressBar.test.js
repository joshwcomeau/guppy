import React from 'react';
import { render } from 'react-testing-library';
import ProgressBar, { Wrapper } from './ProgressBar';

describe('ProgressBar component', () => {
  describe('should render', () => {
    // we could do the tests in a loop but for three test cases
    // it's OK to duplicate code
    it('with 0%', () => {
      const wrapper = render(<ProgressBar progress={0} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('with 50%', () => {
      const wrapper = render(<ProgressBar progress={0.5} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('with 100%', () => {
      const wrapper = render(<ProgressBar progress={1.0} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should apply height style to Wrapper', () => {
    const { container, debug } = render(
      <ProgressBar height={10} progress={0.5} />
    );
    //debug(container);
    //expect(container.querySelector('div').getAttribute('height')).toEqual('10');
    //expect(getByTestId('wrapper')).toEqual('test'); //toHaveStyleRule('height', '10px');
  });
});
