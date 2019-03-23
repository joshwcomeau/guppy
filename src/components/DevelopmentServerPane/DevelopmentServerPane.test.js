/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import lolex from 'lolex';

import { DevelopmentServerPane } from './DevelopmentServerPane';

describe('DevelopmentServerPane component', () => {
  let wrapper;
  let instance;
  lolex.install();

  const task = {
    name: 'start',
    status: 'idle',
  };

  const project = {
    id: 'a-project',
    type: 'create-react-app',
  };

  const mockActions = {
    launchDevServer: jest.fn(),
    abortTask: jest.fn(),
  };

  beforeEach(() => {
    wrapper = shallow(
      <DevelopmentServerPane task={task} project={project} {...mockActions} />
    );
    instance = wrapper.instance();
  });

  describe('Rendering', () => {
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should return message if no tasks', () => {
      wrapper = shallow(<DevelopmentServerPane />);
      expect(wrapper.text()).toMatch(/This project does not appear/);
    });
  });

  describe('Component logic', () => {
    it('should start devServer', () => {
      instance.handleToggle(true);
      expect(mockActions.launchDevServer).toHaveBeenCalledWith(
        task,
        new Date()
      );
    });

    it('should abort task', () => {
      instance.handleToggle(false);
      expect(mockActions.abortTask).toHaveBeenCalledWith(
        task,
        project.type,
        new Date()
      );
    });
  });
});
