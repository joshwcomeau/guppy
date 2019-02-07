import React from 'react';
import { mount } from 'enzyme';
import ProjectName from './ProjectName';
import lolex from 'lolex';

jest.mock('react-tippy', () => ({
  Tooltip: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('ProjectName component', () => {
  let wrapper;
  let instance;
  let mockActions;

  const mountProjectName = isTaken => {
    mockActions = {
      handleFocus: jest.fn(),
      handleBlur: jest.fn(),
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
    };
    return mount(
      <ProjectName
        name=""
        isFocused={true}
        isProjectNameTaken={isTaken}
        {...mockActions}
      />
    );
  };

  lolex.install();

  describe('Rendering', () => {
    it('should render input', () => {
      wrapper = mountProjectName(false);
      expect(wrapper).toMatchSnapshot();
    });
    it('should render input (projectName already taken)', () => {
      wrapper = mountProjectName(true);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Component logic', () => {
    let mockFocus;
    let mockBlur;
    beforeEach(() => {
      jest.useFakeTimers();
      window.clearTimeout = jest.fn();
      // Mounting needed here so refs are working otherwise this.node will be undefined
      wrapper = mountProjectName();
      instance = wrapper.instance();
      mockFocus = jest.fn();
      mockBlur = jest.fn();

      instance.setRef({
        focus: mockFocus,
        blur: mockBlur,
      });
    });

    it('should focus input & show tooltip after a delay (after mount)', () => {
      instance.componentDidMount();
      expect(mockFocus).toBeCalled();

      // Check tooltip
      expect(instance.state.showRandomizeTooltip).toBeFalsy();
      jest.runAllTimers();
      expect(instance.state.showRandomizeTooltip).toBeTruthy();
    });

    it('should clearTimout on unmount', () => {
      instance.componentWillUnmount();
      expect(window.clearTimeout).toBeCalledWith(instance.timeoutId);
    });

    it('should remove tooltip', () => {
      jest.runAllTimers();
      expect(instance.state.showRandomizeTooltip).toBeTruthy();
      instance.getRidOfRandomizeTooltip();
      expect(window.clearTimeout).toBeCalledWith(instance.timeoutId);
      expect(instance.state.showRandomizeTooltip).toBeFalsy();
    });

    it('should create a random name', () => {
      instance.handleRandomize();

      expect(mockActions.handleChange).toBeCalledWith(expect.anything());
      expect(mockFocus).toBeCalledTimes(1);
    });

    // Todo: Check what is submitted with handleSubmit?
    it('should handle submit on enter key', () => {
      instance.maybeHandleSubmit({
        key: 'Enter',
      });
      expect(mockActions.handleSubmit).toBeCalled();
      expect(mockBlur).toBeCalled();
    });

    it('should not submit on any other key', () => {
      instance.maybeHandleSubmit({
        key: 'a',
      });
      expect(mockActions.handleSubmit).not.toBeCalled();
      expect(mockBlur).not.toBeCalled();
    });

    // Note: Scramble method is not tested yet - would be nice to have.
    //       I don't fully understand the method & randomizeCount handling.
    //       randomizeCount starts with zero and will be set to new name length
    //       after first run - so it will scramble from this to a new name
    //       --> why is the if-else there?
    xit('should scramble string', () => {});
  });
});
