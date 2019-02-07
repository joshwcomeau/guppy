/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';

import { ProjectPage } from './ProjectPage';
import FillButton from '../Button/FillButton';

import {
  openProjectInEditor,
  openProjectInFolder,
} from '../../services/shell.service';

jest.mock('../../services/shell.service');

jest.mock('../../services/platform.service', () => ({
  getCopyForOpeningFolder: () => 'Open folder',
}));

const initialState = {
  projects: {
    byId: {
      'a-project': {
        path: 'path/to/project',
        guppy: {
          id: 'a-project',
          name: 'example',
          type: 'create-react-app',
          color: '#fff',
        },
      },
    },
    selectedId: 'a-project',
  },
};

const project = {
  id: 'a-project', // Todo: Check how the id is added in app to project prop
  ...initialState.projects.byId['a-project'],
};

window.scroll = jest.fn();

describe('ProjectPage component', () => {
  let wrapper;
  let instance;
  let mockActions;

  const loadingStates = ['loading', 'done', 'fail'];
  const mountWithStatus = (status, actions) =>
    shallow(
      <ProjectPage
        project={project}
        dependenciesLoadingStatus={status}
        {...actions}
      />
    );

  beforeEach(() => {
    mockActions = {
      loadDependencyInfoFromDisk: jest.fn(),
      reinstallDependencies: jest.fn(),
    };
    wrapper = mountWithStatus('loading', mockActions);
    instance = wrapper.instance();
  });

  describe('Rendering cases', () => {
    loadingStates.forEach(dependencyLoadingStatus => {
      it(`should render project page (${dependencyLoadingStatus})`, () => {
        wrapper = mountWithStatus(dependencyLoadingStatus, mockActions);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  it('should dispatch loadDependencyInfoFromDisk on mount', () => {
    expect(mockActions.loadDependencyInfoFromDisk).toBeCalledWith(
      'a-project',
      project.path
    );
  });

  it('should scroll window to top on mount', () => {
    // Note: Would be nice if we would export the object literal so we can use it here
    expect(window.scroll).toBeCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('should load dependencies for new project', () => {
    instance.componentWillReceiveProps({
      project: {
        ...project,
        id: 'new-project',
      },
    });
    expect(mockActions.loadDependencyInfoFromDisk).toBeCalledTimes(2);
  });

  it('should not load dependency if no new project', () => {
    instance.componentWillReceiveProps({
      project,
      dependenciesLoadingStatus: 'done',
    });
    expect(mockActions.loadDependencyInfoFromDisk).toBeCalledTimes(1);
  });

  it('should trigger open editor', () => {
    instance.openIDE();
    expect(openProjectInEditor).toBeCalledWith(project);
  });

  it('should trigger open folder', () => {
    instance.openFolder();
    expect(openProjectInFolder).toBeCalledWith(project);
  });

  it('should trigger reinstall on click (if node_modules missing)', () => {
    const reinstallDependenciesMock = jest.fn();
    wrapper.setProps({
      dependenciesLoadingStatus: 'fail',
      reinstallDependencies: reinstallDependenciesMock,
    });
    const button = wrapper.find(FillButton).last();
    button.simulate('click');

    expect(reinstallDependenciesMock).toBeCalled();
  });
});
