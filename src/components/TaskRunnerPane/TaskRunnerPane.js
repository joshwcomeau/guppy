// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTasksInTaskListForProjectId } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import Module from '../Module';
import TaskRunnerPaneRow from '../TaskRunnerPaneRow';

import type { Task } from '../../types';

type Props = {
  tasks: Array<Task>,
  runTask: Function,
  abortTask: Function,
};

class TaskRunnerPane extends Component<Props> {
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

  render() {
    const { tasks } = this.props;

    return (
      <Module title="Tasks">
        {tasks.map(task => (
          <TaskRunnerPaneRow
            id={task.id}
            name={task.name}
            description={task.description}
            status={task.status}
            processId={task.processId}
            onToggleTask={this.handleToggleTask}
          />
        ))}
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
