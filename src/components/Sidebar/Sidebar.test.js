/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { mount } from 'enzyme';

import { Sidebar } from './Sidebar';
import AddProjectButton from './AddProjectButton';
import SidebarProjectIcon from './SidebarProjectIcon';
import IntroductionBlurb from './IntroductionBlurb';

import { COLORS } from '../../constants';

const createProps = props => ({
  selectedProjectId: null,
  projects: [],
  onboardingStatus: 'done',
  isVisible: true,
  createNewProjectStart: jest.fn(),
  selectProject: jest.fn(),
  ...props,
});

const testProject = {
  id: 'test-project',
  name: 'Test Project',
  type: 'nextjs',
  icon: 'nextjs-project-icon',
  color: COLORS.red['500'],
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
});
