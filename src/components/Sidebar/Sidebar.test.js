import React from 'react';
import { mount } from 'enzyme';

import { Sidebar } from './Sidebar';
import AddProjectButton from './AddProjectButton';
import SidebarProjectIcon from './SidebarProjectIcon';
import IntroductionBlurb from './IntroductionBlurb';

import { RAW_COLORS } from '../../constants';

const createProps = props => ({
  selectedProjectId: null,
  projects: [],
  onboardingStatus:
    props && props.onboardingStatus ? props.onboardingStatus : 'done',
  isVisible: props && props.isVisible ? props.isVisible : true,
  createNewProjectStart: jest.fn(),
  selectProject: jest.fn(),
  rearrangeProjects: jest.fn(),
  ...props,
});

const testProject = {
  id: 'test-project',
  name: 'Test Project',
  type: 'nextjs',
  icon: 'nextjs-project-icon',
  color: RAW_COLORS.red[500],
  createdAt: 0,
  dependencies: [],
  tasks: [],
  path: '.',
};

describe('Sidebar', () => {
  it('renders add project button correctly', () => {
    const props = createProps();
    const wrapper = mount(<Sidebar {...props} />);
    const addButton = wrapper.find(AddProjectButton);
    expect(addButton).toHaveLength(1);

    addButton.simulate('click');
    expect(props.createNewProjectStart.mock.calls.length).toBe(1);
  });
  it('renders project correctly', () => {
    const props = createProps({ projects: [testProject] });
    const wrapper = mount(<Sidebar {...props} />);
    const projectButton = wrapper.find(SidebarProjectIcon);
    expect(projectButton).toHaveLength(1);
    const button = projectButton.find('button');

    button.simulate('click');
    expect(props.selectProject.mock.calls.length).toBe(1);
  });
  it('renders introduction correctly', () => {
    const props = createProps({ onboardingStatus: 'brand-new' });
    const wrapper = mount(<Sidebar {...props} />);
    const intro = wrapper.find(IntroductionBlurb);
    expect(intro.text()).toMatch(/Your new project was just added.*/);
  });

  describe('Sidebar props', () => {
    let wrapper, instance;
    beforeEach(() => {
      // fake setTimeout - could be removed of the timeouts are refactored with componentDidUpdate
      jest.useFakeTimers();

      const props = createProps({
        onboardingStatus: 'brand-new',
        isVisible: false,
      });
      wrapper = mount(<Sidebar {...props} />);
      instance = wrapper.instance();
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.useRealTimers();
    });

    it('update in sequence on initial display', () => {
      expect(instance.state).toEqual({
        introSequenceStep: null,
      });
      // toggle visibility
      wrapper.setProps({
        isVisible: true,
      });
      expect(instance.state).toEqual({
        introSequenceStep: 'sidebar-slide-in',
      });
      // expect(setTimeout).toHaveBeenCalledTimes(2); // todo: Check why setTimeout is called 7 times - keep this commented for now
      // Fast forward and exhaust only currently pending timers
      // (but not any new timers that get created during that process)
      jest.runOnlyPendingTimers(); // just runs the first timeout

      // Now first timeout is done
      expect(instance.state).toEqual({
        introSequenceStep: 'first-project-fall-in',
      });
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 600);

      // Run remaining timer
      jest.runAllTimers();
      expect(instance.state).toEqual({
        introSequenceStep: 'add-projects-fade-in',
      });
    });
    it(`should reset introSequenceStep if onboardingStatus changes to 'brand-new'`, () => {
      wrapper.setProps({ isVisible: true });
      jest.runAllTimers();
      // introSequenceStep is 'add-projects-fade-in'
      wrapper.setProps({ onboardingStatus: 'brand-new' }); // triggers reset
      expect(instance.state).toEqual({ introSequenceStep: null });
    });
  });

  describe('Sidebar drag & drop', () => {
    it('should rearrange onDragEnd', () => {
      const props = createProps();
      const wrapper = mount(<Sidebar {...props} />);
      const instance = wrapper.instance();

      expect(instance.onDragEnd({ destination: null })).toBeUndefined();
      instance.onDragEnd({
        source: {
          index: 0,
        },
        destination: {
          index: 1,
        },
      });
      expect(wrapper.prop('rearrangeProjects')).toHaveBeenLastCalledWith(0, 1);
    });
  });
});
