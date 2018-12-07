import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Sidebar } from './Sidebar';
import { COLORS } from '../../constants';

const createProps = props => ({
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
  color: COLORS.red,
  createdAt: 0,
  dependencies: [],
  tasks: [],
  path: '.',
};

describe('Sidebar', () => {
  it('renders add project button correctly', () => {
    const props = createProps();

    const { getByTestId } = render(<Sidebar {...props} />);

    const addProjectButton = getByTestId('add-project-button');
    expect(addProjectButton).toBeInTheDocument();

    fireEvent.click(addProjectButton);
    expect(props.createNewProjectStart).toHaveBeenCalledTimes(1);
  });

  it('renders project correctly', () => {
    const props = createProps({ projects: [testProject] });

    const { getByTestId } = render(<Sidebar {...props} />);

    const projectButton = getByTestId('test-project');
    expect(projectButton).toBeInTheDocument();

    fireEvent.click(projectButton);
    expect(props.selectProject).toHaveBeenCalledTimes(1);
  });

  it('renders introduction correctly', () => {
    const props = createProps({ onboardingStatus: 'brand-new' });

    const { getByText } = render(<Sidebar {...props} />);

    const projectButton = getByText(/Your new project was just added.*/);
    expect(projectButton).toBeInTheDocument();
  });
});
