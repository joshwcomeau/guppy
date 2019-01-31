/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import { ProjectConfigurationModal } from './ProjectConfigurationModal';

describe('ProjectConfigurationModal component', () => {
  let wrapper;
  let instance;

  const project = {
    id: 'a-project',
    name: 'A project',
    projectIcon: 'icon',
  };

  describe('Rendering', () => {
    const shallowRender = installActive =>
      shallow(
        <ProjectConfigurationModal
          isVisible={true}
          project={project}
          dependenciesChangingForProject={installActive}
        />
      );

    it('should render', () => {
      wrapper = shallowRender(false);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with active dependency installation', () => {
      wrapper = shallowRender(true);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
