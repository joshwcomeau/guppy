/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import { shallow } from 'enzyme';
import { TaskRunnerPane } from './TaskRunnerPane';
import TaskRunnerPaneRow from '../TaskRunnerPaneRow';
import TaskDetailsModal from '../TaskDetailsModal';
import lolex from 'lolex';

describe('TaskRunnerPane component', () => {
  let wrapper;
  let instance;
  const tasks = [
    {
      projectId: 'a-project',
      name: 'build',
      description: 'Start build task',
      type: 'short-term', // or sustained
      status: 'idle', // pending, success or failed
    },
    {
      projectId: 'a-project',
      name: 'devServer',
      description: 'Start devServer task',
      type: 'sustained', // or sustained
      status: 'pending', // pending, success or failed
      processId: 'process-id',
    },
  ];

  const project = {
    id: 'a-project',
    type: 'create-react-app',
  };

  lolex.install(); // mocks new Date()

  describe('Rendering', () => {
    it('should render two tasks', () => {
      wrapper = shallow(
        <TaskRunnerPane tasks={tasks} dependenciesChangingForProject={false} />
      );

      expect(wrapper.find(TaskRunnerPaneRow)).toHaveLength(2);
    });

    it('should render TaskDetailsModal', () => {
      wrapper = shallow(
        <TaskRunnerPane tasks={tasks} dependenciesChangingForProject={false} />
      );

      expect(wrapper.find(TaskDetailsModal)).toHaveLength(1);
    });

    it(`shouldn't render if there are no tasks`, () => {
      wrapper = shallow(
        <TaskRunnerPane tasks={[]} dependenciesChangingForProject={false} />
      );
      expect(wrapper.html()).toBe(null);
    });
  });

  describe('Component logic', () => {
    const mockActions = {
      runTask: jest.fn(),
      abortTask: jest.fn(),
    };

    beforeEach(() => {
      wrapper = shallow(
        <TaskRunnerPane
          tasks={tasks}
          project={project}
          dependenciesChangingForProject={false}
          {...mockActions}
        />
      );
      instance = wrapper.instance();
    });

    it(`should unselect task if it doesn't exists`, () => {
      instance.handleViewDetails('build'); // selects build task
      expect(instance.state.selectedTaskName).toEqual('build');

      instance.componentWillReceiveProps({ tasks: [] });
      expect(instance.state.selectedTaskName).toBeNull();
    });

    it('should not affect selection if selected task exists', () => {
      instance.handleViewDetails('build'); // selects build task
      instance.componentWillReceiveProps({ tasks });
      expect(instance.state.selectedTaskName).toEqual('build');
    });

    it('should toggle task to active', () => {
      instance.handleToggleTask('build');

      expect(mockActions.runTask).toHaveBeenCalledWith(tasks[0], new Date());
    });

    it('should abort task', () => {
      instance.handleToggleTask('devServer');

      expect(mockActions.abortTask).toHaveBeenCalledWith(
        tasks[1],
        project.type,
        new Date()
      );
    });

    it('should dismiss task details', () => {
      instance.handleViewDetails('build'); // selects build task
      expect(instance.state.selectedTaskName).toEqual('build');

      instance.handleDismissTaskDetails();
      expect(instance.state.selectedTaskName).toBeNull();
    });
  });
});
