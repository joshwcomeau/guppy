// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTasksInTaskListForProjectId } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import Module from '../Module';
import Modal from '../Modal';
import TaskRunnerPaneRow from '../TaskRunnerPaneRow';
import TaskDetailsModal from '../TaskDetailsModal';

import type { Task } from '../../types';

type Props = {
  tasks: Array<Task>,
  runTask: Function,
  abortTask: Function,
};

type State = {
  selectedTaskId: ?string,
};

class TaskRunnerPane extends Component<Props, State> {
  state = {
    selectedTaskId: null,
  };

  handleToggleTask = taskId => {
    const { tasks, runTask, abortTask } = this.props;

    const task = tasks.find(task => task.id === taskId);

    // Should be impossible, this is for Flow.
    if (!task) {
      return;
    }

    const isRunning = !!task.processId;

    const timestamp = new Date();

    isRunning ? abortTask(task, timestamp) : runTask(task, timestamp);
  };

  handleViewDetails = taskId => {
    this.setState({ selectedTaskId: taskId });
  };

  handleDismissTaskDetails = () => {
    this.setState({ selectedTaskId: null });
  };

  render() {
    const { tasks } = this.props;
    const { selectedTaskId } = this.state;

    return (
      <Module title="Tasks">
        {tasks.map(task => (
          <TaskRunnerPaneRow
            key={task.id}
            id={task.id}
            name={task.name}
            description={task.description}
            status={task.status}
            processId={task.processId}
            onToggleTask={this.handleToggleTask}
            onViewDetails={this.handleViewDetails}
          />
        ))}

        <TaskDetailsModal
          taskId={selectedTaskId}
          isVisible={!!selectedTaskId}
          onDismiss={this.handleDismissTaskDetails}
        />
      </Module>
    );
  }
}

const mapStateToProps = state => {
  const selectedProjectId = getSelectedProjectId(state);

  const tasks = selectedProjectId
    ? getTasksInTaskListForProjectId(selectedProjectId, state)
    : [];

  return { tasks };
};

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(TaskRunnerPane);
