// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';

import { runTask, abortTask } from '../../actions';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';
import { getTaskById } from '../../reducers/tasks.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Toggle from '../Toggle';
import LargeLED from '../LargeLED';
import EjectButton from '../EjectButton';
import TerminalOutput from '../TerminalOutput';
import Spacer from '../Spacer';

import type { Task } from '../../types';

type Props = {
  taskId: ?string,
  isVisible: boolean,
  onDismiss: () => void,
  // From Redux:
  task: Task,
  runTask: (task: Task, timestamp: Date) => any,
  abortTask: (task: Task, timestamp: Date) => any,
};

class TaskDetailsModal extends PureComponent<Props> {
  handleToggle = () => {
    const { task, runTask, abortTask } = this.props;

    const isRunning = !!task.processId;

    const timestamp = new Date();

    isRunning ? abortTask(task, timestamp) : runTask(task, timestamp);
  };

  getStatusText = () => {
    const { status, timeSinceStatusChange } = this.props.task;

    switch (status) {
      case 'idle': {
        return (
          <span>
            Task is <strong>idle</strong>.
            {timeSinceStatusChange && (
              <LastRunText>
                Last run:{' '}
                {moment(timeSinceStatusChange).format(
                  'MMMM Do, YYYY [at] h:mm a'
                )}
              </LastRunText>
            )}
          </span>
        );
      }
      case 'pending': {
        return (
          <span>
            Task is{' '}
            <strong style={{ color: COLORS.orange[500] }}>running</strong>...
          </span>
        );
      }

      case 'success': {
        return (
          <span>
            Task{' '}
            <strong style={{ color: COLORS.green[700] }}>
              completed successfully
            </strong>.
            <LastRunText>
              {moment(timeSinceStatusChange).calendar()}
            </LastRunText>
          </span>
        );
      }

      case 'failed': {
        return (
          <span>
            Task <strong>failed</strong>.
            <LastRunText>
              {moment(timeSinceStatusChange).calendar()}
            </LastRunText>
          </span>
        );
      }

      default: {
        throw new Error('Unrecognized status in TaskDetailsModal');
      }
    }
  };

  renderContents() {
    const { task, isVisible } = this.props;

    if (!isVisible) {
      return null;
    }

    const { name, description, status, processId, logs } = task;

    const isRunning = !!processId;

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
            <LargeLED size={32} status={status} />
            <StatusLabel>{this.getStatusText()}</StatusLabel>
          </Status>

          <Spacer size={25} />

          <TerminalOutput height={425} logs={logs} />
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
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const StatusLabel = styled.div`
  margin-left: 10px;
`;

const LastRunText = styled.span`
  margin-left: 10px;
  color: ${COLORS.gray[400]};
`;

const mapStateToProps = (state, ownProps) => ({
  task: getTaskById(state, ownProps.taskId),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(TaskDetailsModal);
