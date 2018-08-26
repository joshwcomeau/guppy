// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { runTask, abortTask } from '../../actions';
import { GUPPY_REPO_URL } from '../../constants';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTasksInTaskListForProjectId } from '../../reducers/tasks.reducer';

import Module from '../Module';
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

  componentWillReceiveProps(nextProps) {
    // It's possible that this task is deleted while the modal is open;
    // For example, This can happen when ejecting the project, since the
    // create-react-app "eject" task removes itself upon completion.
    const selectedTaskExists = nextProps.tasks.some(
      task => task.id === this.state.selectedTaskId
    );

    if (!selectedTaskExists) {
      this.setState({ selectedTaskId: null });
    }
  }

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

    if (tasks.length === 0) {
      // If the user deletes all `scripts` from their package.json, we don't
      // need to show this module.
      // (this shouldn't really ever happen)
      return null;
    }

    return (
      <Module
        title="Tasks"
        moreInfoHref={`${GUPPY_REPO_URL}/blob/master/docs/getting-started.md#tasks`}
      >
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
    ? getTasksInTaskListForProjectId(state, selectedProjectId)
    : [];

  return { tasks };
};

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(TaskRunnerPane);
