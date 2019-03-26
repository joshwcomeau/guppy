import React from 'react';
import { shallow } from 'enzyme';

import BuildStepProgress from '../BuildStepProgress';

describe('BuildStepProgress component', () => {
  let wrapper;
  let instance;

  const mockStep = {
    copy: 'Building...',
    additionalCopy: 'This may take some time',
  };

  jest.useFakeTimers();

  beforeEach(() => {
    wrapper = shallow(<BuildStepProgress step={mockStep} status="upcoming" />);
    instance = wrapper.instance();
  });

  it('should render upcoming', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render in-progress', () => {
    wrapper.setProps({ status: 'in-progress' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render done', () => {
    wrapper.setProps({ status: 'done' });
    expect(wrapper).toMatchSnapshot();
  });

  describe('Component logic', () => {
    it('should hide additional copy if done', () => {
      wrapper.setState({
        shouldShowAdditionalCopy: true,
      });
      wrapper.setProps({
        status: 'done',
      });
      expect(instance.state.shouldShowAdditionalCopy).toBeFalsy();
    });

    it('should show additonal copy after a delay', () => {
      wrapper.setProps({
        status: 'in-progress',
      });
      jest.runAllTimers();
      expect(instance.state.shouldShowAdditionalCopy).toBeTruthy();
    });

    it('should clear timeout on unmount', () => {
      window.clearTimeout = jest.fn();
      instance.componentWillUnmount();
      expect(window.clearTimeout).toHaveBeenCalledWith(instance.timeoutId);
    });
  });
});
