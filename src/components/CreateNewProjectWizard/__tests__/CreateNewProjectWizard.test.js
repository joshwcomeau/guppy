import React from 'react';
import { shallow } from 'enzyme';
import { remote } from 'electron'; // Mocked

import {
  CreateNewProjectWizard,
  dialogOptionsFolderExists,
  dialogCallbackFolderExists,
  dialogStarterNotFoundErrorArgs,
  FORM_STEPS,
} from '../CreateNewProjectWizard';
import { initialState as appSettingsInitialState } from '../../../reducers/app-settings.reducer';

const projectHomePath = '/users/guppy-dev';

jest.mock('../../../services/create-project.service', () => ({
  checkIfProjectExists: jest.fn(
    (path, name) => path === '/users/guppy-dev' && name === 'first-project'
  ),
  getProjectNameSlug: jest.requireActual(
    '../../../services/create-project.service'
  ).getProjectNameSlug,
}));

jest.mock('../../../services/check-if-url-exists.service', () => ({
  urlExists: jest.fn(starterUrl =>
    Promise.resolve(starterUrl.includes('gatsby-blog-starter'))
  ),
}));

jest.useFakeTimers();

const { dialog } = remote;

describe('CreateNewProjectWizard component', () => {
  let wrapper;
  let instance;
  let mockActions;

  // Create some projects with just a name key as it is needed for uniqueness check
  const mockProjects = {
    'first-project-id': {
      name: 'first-project',
    },
    'second-project-id': {
      name: 'second-project',
    },
  };

  const newProject = {
    name: 'New project',
    projectType: 'create-react-app',
    projectIcon: 'icon',
  };

  const mockAppSettingsState = {
    ...appSettingsInitialState,
    general: {
      defaultProjectPath: projectHomePath,
    },
  };

  beforeEach(() => {
    mockActions = {
      addProject: jest.fn(),
      createNewProjectCancel: jest.fn(),
      createNewProjectFinish: jest.fn(),
    };
    window.clearTimeout = jest.fn();
    wrapper = shallow(
      <CreateNewProjectWizard
        projects={mockProjects}
        projectHomePath={projectHomePath}
        isVisible={true}
        isOnboardingCompleted={true}
        settings={mockAppSettingsState}
        {...mockActions}
      />
    );
    instance = wrapper.instance();
  });
  it('should render TwoPaneModal', () => {
    expect(wrapper.renderProp('children')(true)).toMatchSnapshot();
  });

  it('should initialize on mount', () => {
    instance.reinitialize = jest.fn();
    instance.componentDidMount();
    expect(instance.reinitialize).toHaveBeenCalled();
  });

  it('should clear timeout on unmount', () => {
    instance.componentWillUnmount();
    expect(window.clearTimeout).toHaveBeenCalledWith(instance.timeoutId);
  });

  it('should update field and check uniqueness of projectName', () => {
    const newProjectName = 'New Project Name';
    instance.verifyProjectNameUniqueness = jest.fn();
    instance.updateFieldValue('projectName', newProjectName);
    expect(instance.state.projectName).toEqual(newProjectName);
    expect(instance.state.activeField).toEqual('projectName');
    expect(instance.verifyProjectNameUniqueness).toHaveBeenCalledWith(
      newProjectName
    );

    // update other field
    instance.verifyProjectNameUniqueness = jest.fn();
    instance.updateFieldValue('projectIcon', 'new-icon');
    expect(instance.verifyProjectNameUniqueness).not.toHaveBeenCalled();
  });

  it('should set focus', () => {
    instance.focusField('projectName');
    expect(instance.state.activeField).toEqual('projectName');
  });

  it('should update isProjectTaken', () => {
    instance.updateFieldValue('projectName', 'First project');
    expect(instance.state.isProjectNameTaken).toBe(true);
    instance.updateFieldValue('projectName', 'New project');
    expect(instance.state.isProjectNameTaken).toBe(false);
  });

  it('should check project location usage (exists on disk)', () => {
    wrapper.setState({
      projectName: 'first-project',
    });
    instance.checkProjectLocationUsage();
    expect(dialog.showMessageBox).toHaveBeenCalledWith(
      dialogOptionsFolderExists,
      expect.anything()
    );

    const resolveMock = jest.fn();
    const rejectMock = jest.fn();
    dialogCallbackFolderExists(resolveMock, rejectMock).call(instance, 0);
    expect(rejectMock).toHaveBeenCalled();

    dialogCallbackFolderExists(resolveMock, rejectMock).call(instance, 1);
    expect(resolveMock).toHaveBeenCalled();
  });

  it('should check project location usage (new project)', async () => {
    wrapper.setState({
      projectName: 'new-project',
    });
    await expect(instance.checkProjectLocationUsage()).resolves.toBeUndefined();
  });

  it('should check if starter url exists', async () => {
    wrapper.setState({
      projectStarter: 'gatsby-blog-starter',
    });

    expect(instance.checkIfStarterUrlExists()).resolves.not.toThrow();

    // should return undefined for empty starter
    wrapper.setState({
      projectStarter: '',
    });

    expect(await instance.checkIfStarterUrlExists()).toBeUndefined();

    wrapper.setState({
      projectStarter: 'not-existing-starter',
    });

    await expect(instance.checkIfStarterUrlExists()).rejects.toThrow(
      'starter-not-found'
    );

    expect(dialog.showErrorBox).toHaveBeenCalledWith(
      ...dialogStarterNotFoundErrorArgs(
        'https://github.com/gatsbyjs/not-existing-starter'
      )
    );
  });

  it('should dispatch createNewProjectFinish & add project (finishBuilding)', () => {
    const projectType = 'create-react-app';
    wrapper.setState({
      projectType,
    });
    instance.reinitialize = jest.fn();

    instance.finishBuilding(newProject);
    expect(mockActions.createNewProjectFinish).toHaveBeenCalled();

    jest.runAllTimers();
    expect(mockActions.addProject).toHaveBeenCalledWith(
      newProject,
      projectHomePath,
      projectType,
      true
    );
    expect(instance.reinitialize).toHaveBeenCalled();
  });

  it('should throw error if projectType not defined (finishBuilding)', () => {
    expect(instance.finishBuilding).toThrow(
      'Project created without projectType'
    );
  });

  describe('Submit button (next step & build)', () => {
    it('should set next step if not build click', () => {
      wrapper.setState({
        currentStep: 'projectName',
        projectType: 'gatsby',
      });
      instance.handleSubmit();
      expect(instance.state).toEqual(
        expect.objectContaining({
          currentStep: FORM_STEPS[1],
          activeField: FORM_STEPS[1],
        })
      );
    });

    it('should trigger build & checks before starting build', async () => {
      // mock checks
      instance.checkProjectLocationUsage = jest.fn();
      instance.checkIfStarterUrlExists = jest.fn();
      wrapper.setState({
        currentStep: 'projectStarter',
        projectType: 'gatsby',
      });
      await instance.handleSubmit();
      expect(instance.checkProjectLocationUsage).toHaveBeenCalled();
      expect(instance.checkIfStarterUrlExists).toHaveBeenCalled();
      expect(instance.state.status).toEqual('building-project');
    });
  });
});
