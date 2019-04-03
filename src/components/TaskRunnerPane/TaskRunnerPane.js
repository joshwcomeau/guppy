// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { GUPPY_REPO_URL } from '../../constants';
import {
  getSelectedProjectId,
  getSelectedProject,
} from '../../reducers/projects.reducer';
import {
  getTasksInTaskListForProjectId,
  isTaskDisabled,
} from '../../reducers/tasks.reducer';
import { getIsQueueEmpty } from '../../reducers/queue.reducer';

import Module from '../Module';
import TaskRunnerPaneRow from '../TaskRunnerPaneRow';
import TaskDetailsModal from '../TaskDetailsModal';

import type { Task, Project } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  projectId: string,
  project: Project,
  tasks: Array<Task>,
  runTask: Dispatch<typeof actions.runTask>,
  abortTask: Dispatch<typeof actions.abortTask>,
  dependenciesChangingForProject: boolean,
};

type State = {
  selectedTaskName: ?string,
};

export class TaskRunnerPane extends Component<Props, State> {
  state = {
    selectedTaskName: null,
  };

  componentWillReceiveProps(nextProps: Props) {
    // It's possible that this task is deleted while the modal is open;
    // For example, This can happen when ejecting the project, since the
    // create-react-app "eject" task removes itself upon completion.
    const selectedTaskExists = nextProps.tasks.some(
      task => task.name === this.state.selectedTaskName
    );

    if (!selectedTaskExists) {
      this.setState({ selectedTaskName: null });
    }
  }

  handleToggleTask = (taskName: string) => {
    const { tasks, runTask, abortTask, project } = this.props;

    // eslint-disable-next-line no-shadow
    const task = tasks.find(task => task.name === taskName);

    // Should be impossible, this is for Flow.
    if (!task) {
      return;
    }

    const isRunning = !!task.processId;

    const timestamp = new Date();

    isRunning
      ? abortTask(task, project.type, timestamp)
      : runTask(task, timestamp);
  };

  handleViewDetails = (taskName: string) => {
    this.setState({ selectedTaskName: taskName });
  };

  handleDismissTaskDetails = () => {
    this.setState({ selectedTaskName: null });
  };

  render() {
    const { tasks, dependenciesChangingForProject } = this.props;
    const { selectedTaskName } = this.state;

    if (tasks.length === 0) {
      // If the user deletes all `scripts` from their package.json, we don't
      // need to show this module.
      // (this shouldn't really ever happen)
      return null;
    }

    const { projectId } = tasks[0];

    return (
      <Module
        title="Tasks"
        moreInfoHref={`${GUPPY_REPO_URL}/blob/master/docs/getting-started.md#tasks`}
      >
        {tasks.map(task => (
          <TaskRunnerPaneRow
            key={task.name}
            name={task.name}
            description={task.description}
            status={task.status}
            processId={task.processId}
            isDisabled={isTaskDisabled(task, dependenciesChangingForProject)}
            onToggleTask={this.handleToggleTask}
            onViewDetails={this.handleViewDetails}
          />
        ))}

        <TaskDetailsModal
          projectId={projectId}
          taskName={selectedTaskName}
          isVisible={!!selectedTaskName}
          onDismiss={this.handleDismissTaskDetails}
        />
      </Module>
    );
  }
}

const mapStateToProps = state => {
  const selectedProject = getSelectedProject(state);

  const projectId = getSelectedProjectId(state);

  const dependenciesChangingForProject =
    projectId && !getIsQueueEmpty(state, { projectId });

  const tasks = projectId
    ? getTasksInTaskListForProjectId(state, { projectId })
    : [];

  return { tasks, dependenciesChangingForProject, project: selectedProject };
};

export default connect(
  mapStateToProps,
  { runTask: actions.runTask, abortTask: actions.abortTask }
)(TaskRunnerPane);
