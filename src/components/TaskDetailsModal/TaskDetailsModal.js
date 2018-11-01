// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import * as actions from '../../actions';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';
import {
  getTaskByProjectIdAndTaskName,
  isTaskDisabled,
} from '../../reducers/tasks.reducer';
import { getIsQueueEmpty } from '../../reducers/queue.reducer';
import { getSelectedProject } from '../../reducers/projects.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Toggle from '../Toggle';
import LargeLED from '../LargeLED';
import EjectButton from '../EjectButton';
import TerminalOutput from '../TerminalOutput';
import WindowDimensions from '../WindowDimensions';

import type { Task, Project } from '../../types';

type Props = {
  projectId: string,
  taskName: ?string,
  isVisible: boolean,
  isDisabled: boolean,
  onDismiss: () => void,
  // From Redux:
  task: Task,
  project: Project,
  runTask: (task: Task, timestamp: Date) => any,
  abortTask: (task: Task, projectType: string, timestamp: Date) => any,
};

class TaskDetailsModal extends PureComponent<Props> {
  handleToggle = () => {
    const { task, runTask, abortTask, project } = this.props;

    const isRunning = !!task.processId;

    const timestamp = new Date();

    isRunning
      ? abortTask(task, project.type, timestamp)
      : runTask(task, timestamp);
  };

  renderPrimaryStatusText = () => {
    const { status } = this.props.task;

    switch (status) {
      case 'idle':
        return (
          <PrimaryStatusText>
            Task is <strong>idle</strong>.
          </PrimaryStatusText>
        );

      case 'pending':
        return (
          <PrimaryStatusText>
            Task is{' '}
            <strong style={{ color: COLORS.orange[500] }}>running</strong>...
          </PrimaryStatusText>
        );

      case 'success':
        return (
          <PrimaryStatusText>
            Task{' '}
            <strong style={{ color: COLORS.green[700] }}>
              completed successfully
            </strong>.
          </PrimaryStatusText>
        );

      case 'failed':
        return (
          <PrimaryStatusText>
            Task <strong>failed</strong>.
          </PrimaryStatusText>
        );

      default:
        throw new Error('Unrecognized status in TaskDetailsModal.');
    }
  };

  renderTimestamp = () => {
    const { status, timeSinceStatusChange } = this.props.task;

    if (!timeSinceStatusChange) {
      return null;
    }

    switch (status) {
      case 'idle':
        return (
          <LastRunText>
            Last run:{' '}
            {moment(timeSinceStatusChange).format('MMMM Do, YYYY [at] h:mm a')}
          </LastRunText>
        );

      case 'pending':
        return null;

      case 'success':
      case 'failed':
        return (
          <LastRunText>{moment(timeSinceStatusChange).calendar()}</LastRunText>
        );

      default: {
        throw new Error('Unrecognized status in TaskDetailsModal.');
      }
    }
  };

  renderContents() {
    const { task, isVisible, isDisabled } = this.props;

    if (!isVisible) {
      return null;
    }

    const { name, description, status, processId } = task;

    const isRunning = !!processId;

    // HACK: So, we want the terminal to occupy as much height as it can.
    // To do this, we set it to the window height, minus the height of all the
    // other stuff added together.
    // I can't simply use a flex column because the available modal height is
    // unknown.
    // It doesn't have to be perfect, so I'm not worried about small changes to
    // the header or status indicators.
    const APPROXIMATE_NON_TERMINAL_HEIGHT = 380;

    return (
      <Fragment>
        <ModalHeader
          title={capitalize(name)}
          action={
            name === 'eject' ? (
              <EjectButton
                width={40}
                height={34}
                isRunning={isRunning}
                onClick={this.handleToggle}
              />
            ) : (
              <Toggle
                size={32}
                isDisabled={isDisabled}
                isToggled={isRunning}
                onToggle={this.handleToggle}
              />
            )
          }
        >
          <Description>{description}</Description>
        </ModalHeader>

        <MainContent>
          <Status>
            <LargeLED size={48} status={status} />
            <StatusLabel>
              {this.renderPrimaryStatusText()}
              {this.renderTimestamp()}
            </StatusLabel>
          </Status>

          <HorizontalRule />

          <WindowDimensions>
            {({ height }) => (
              <TerminalOutput
                height={height - APPROXIMATE_NON_TERMINAL_HEIGHT}
                title="Output"
                task={task}
              />
            )}
          </WindowDimensions>
        </MainContent>
      </Fragment>
    );
  }

  render() {
    const { isVisible, onDismiss } = this.props;

    return (
      <Modal width={620} isVisible={isVisible} onDismiss={onDismiss}>
        {this.renderContents()}
      </Modal>
    );
  }
}

const MainContent = styled.section`
  padding: 25px;
`;

const Description = styled.div`
  font-size: 21px;
  color: ${COLORS.gray[500]};
`;

const Status = styled.div`
  display: flex;
  align-items: center;
`;

const StatusLabel = styled.div`
  margin-left: 10px;
`;

const PrimaryStatusText = styled.div`
  font-size: 20px;
`;

const LastRunText = styled.div`
  color: ${COLORS.gray[400]};
  font-size: 16px;
`;

const HorizontalRule = styled.div`
  height: 0px;
  margin-top: 25px;
  border-bottom: 1px solid ${COLORS.gray[200]};
`;

const mapStateToProps = (state, ownProps) => {
  const selectedProject = getSelectedProject(state);
  const dependenciesChangingForProject = !getIsQueueEmpty(state, ownProps);
  const task = getTaskByProjectIdAndTaskName(state, ownProps);

  const isDisabled =
    task && isTaskDisabled(task, dependenciesChangingForProject);

  return {
    task,
    project: selectedProject,
    isDisabled,
  };
};

export default connect(
  mapStateToProps,
  { runTask: actions.runTask, abortTask: actions.abortTask }
)(TaskDetailsModal);
