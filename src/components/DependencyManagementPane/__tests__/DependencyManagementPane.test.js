import React from 'react';
import { shallow, mount } from 'enzyme';

import {
  DependencyManagementPane,
  DependencyButton,
  Dependencies,
  MainContent,
  AddDependencyButton,
} from '../DependencyManagementPane';
import AddDependencyModal from '../AddDependencyModal';

describe('DependencyManagement component', () => {
  let wrapper;
  let instance;

  const project = {
    id: 'projectId',
    dependencies: [
      {
        name: 'React',
        status: 'idle',
        location: 'dependencies',
        version: '16.0.0',
      },
      {
        name: 'Redux',
        status: 'idle',
        location: 'devDependencies',
        version: '4.0.0',
      },
    ],
  };

  beforeEach(() => {
    wrapper = shallow(<DependencyManagementPane project={project} />);
    instance = wrapper.instance();
  });

  describe('Rendering', () => {
    it('should render a dependency list with two buttons', () => {
      expect(wrapper.find(Dependencies)).toMatchSnapshot();
    });

    it('should render main content for selected dependency (default)', () => {
      expect(wrapper.find(MainContent)).toMatchSnapshot();
    });

    it('should render main content for selected dependency (installing)', () => {
      wrapper.setProps({
        project: {
          ...project,
          dependencies: [
            {
              ...project.dependencies[0],
              status: 'installing',
            },
            project.dependencies[1],
          ],
        },
      });

      expect(wrapper.find(MainContent)).toMatchSnapshot();
    });

    it('should render list addon for React dependency (not selected)', () => {
      expect(
        mount(instance.renderListAddon(project.dependencies[0], false))
      ).toMatchSnapshot();
    });

    it('should render list addon for React dependency (selected)', () => {
      expect(
        mount(instance.renderListAddon(project.dependencies[0], true))
      ).toMatchSnapshot();
    });
  });

  describe('Component logic', () => {
    it('should select dependency on click', () => {
      // We're selecting the last dep. so we're having an index larger than 0
      const button = wrapper.find(DependencyButton).last();
      button.simulate('click');
      expect(instance.state.selectedDependencyIndex).toBe(
        project.dependencies.length - 1
      );
    });

    it('should select the newly added dependency', () => {
      const updatedProject = {
        project: {
          ...project,
          dependencies: [
            ...project.dependencies,
            {
              name: 'Loadash',
              status: 'idle',
              location: 'dependencies',
            },
          ],
        },
      };
      wrapper.setProps(updatedProject);

      expect(instance.state.selectedDependencyIndex).toBe(
        updatedProject.project.dependencies.length - 1
      );
    });

    it('should change selection if selectedIndex out of range', () => {
      wrapper.setState({
        selectedDependencyIndex: 1,
      });
      wrapper.setProps({
        project: {
          ...project,
          dependencies: [project.dependencies[0]],
        },
      });

      expect(instance.state.selectedDependencyIndex).toBe(0);
    });

    it('should open addingNewDependency modal', () => {
      const button = wrapper.find(AddDependencyButton);
      button.simulate('click');

      expect(instance.state.addingNewDependency).toBeTruthy();
    });

    it('should hide addingNewDependency modal on dismiss', () => {
      wrapper.setState({
        addingNewDependency: true,
      });
      const modal = wrapper.find(AddDependencyModal);

      modal.prop('onDismiss')();
      expect(instance.state.addingNewDependency).toBeFalsy();
    });
  });
});
