/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import {
  ProjectConfigurationModal,
  initialState,
} from './ProjectConfigurationModal';
import FormField from '../FormField';

describe('ProjectConfigurationModal component', () => {
  let wrapper;
  let instance;
  let mockActions;

  const project = {
    id: 'a-project',
    name: 'A project',
    projectIcon: 'icon',
  };

  const shallowRender = (installActive = false) => {
    mockActions = {
      hideModal: jest.fn(),
      saveProjectSettings: jest.fn(),
    };
    return shallow(
      <ProjectConfigurationModal
        isVisible={true}
        project={project}
        dependenciesChangingForProject={installActive}
        {...mockActions}
      />
    );
  };

  describe('Rendering', () => {
    it('should render', () => {
      wrapper = shallowRender(false);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with active dependency installation (save disabled)', () => {
      wrapper = shallowRender(true);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Component logic', () => {
    const newProject = {
      name: 'new-project',
      icon: 'another-icon',
    };

    beforeEach(() => {
      wrapper = shallowRender();
      instance = wrapper.instance();
    });

    it('should update local form state for new project', () => {
      instance.componentWillReceiveProps({
        project: newProject,
      });
      // Note: If there would be more options we could use a project key on state
      //       so we can easily compare the object here. Or we could use a loop to check each key -
      //       for now it'S OK to repeat the assertions because there are just two keys.
      expect(instance.state.newName).toEqual(newProject.name);
      expect(instance.state.projectIcon).toEqual(newProject.icon);
    });

    it('should not update local form state if project undefined', () => {
      // project is always defined - this is needed for flow type check
      instance.componentWillReceiveProps({ project: null });
      expect(instance.state).toBe(initialState);
    });

    it('should save new settings', () => {
      instance.componentWillReceiveProps({
        project: newProject,
      });
      // Note: Simulate click on save button wasn't working
      //       that's why I'm submitting the form
      wrapper.find('form').simulate('submit', {
        preventDefault: jest.fn(),
      });

      expect(mockActions.saveProjectSettings).toHaveBeenCalledWith(
        instance.state.newName,
        instance.state.projectIcon,
        project
      );
    });

    describe('Form handling', () => {
      it('should save settings on enter key', () => {
        instance.handleKeyPress({
          preventDefault: jest.fn(),
          key: 'Enter',
        });
        expect(mockActions.saveProjectSettings).toHaveBeenCalled();
      });

      it('should not save on other keypress', () => {
        instance.handleKeyPress({
          preventDefault: jest.fn(),
          key: 'a',
        });
        expect(mockActions.saveProjectSettings).not.toHaveBeenCalled();
      });

      it('should updateProject icon in local state', () => {
        instance.updateProjectIcon('new-icon', {
          preventDefault: jest.fn(),
        });
        expect(instance.state.projectIcon).toEqual('new-icon');
      });

      it('should set a form field to active in local state', () => {
        instance.setActive('projectName');
        expect(instance.state.activeField).toEqual('projectName');
      });

      it('should set activeField to projectName on text input focus', () => {
        instance.setActive('projectIcon');
        expect(instance.state.activeField).toEqual('projectIcon');
        const input = wrapper
          .find(FormField)
          .find('[label="Project name"]')
          .children();
        input.prop('onFocus')();

        expect(instance.state.activeField).toEqual('projectName');
      });

      it('should change newName on input change', () => {
        instance.changeProjectName({
          currentTarget: {
            value: 'New name',
          },
        });

        expect(instance.state.newName).toEqual('New name');
      });
    });
  });
});
