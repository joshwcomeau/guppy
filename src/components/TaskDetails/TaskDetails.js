// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import IconBase from 'react-icons-kit';
import { u231B as hourglass } from 'react-icons-kit/noto_emoji_regular/u231B';
import { u1F553 as clock } from 'react-icons-kit/noto_emoji_regular/u1F553';

import { runTask, abortTask } from '../../actions';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';
import { getTaskById } from '../../reducers/tasks.reducer';

import Heading from '../Heading';
import Toggle from '../Toggle';
import PixelShifter from '../PixelShifter';
import LargeLED from '../LargeLED';
import TerminalOutput from '../TerminalOutput';
import Spacer from '../Spacer';

import type { Task } from '../../types';

type Props = {
  taskId: ?string,
  task: Task,
  runTask: (task: Task, timestamp: Date) => any,
  abortTask: (task: Task, timestamp: Date) => any,
};

class TaskDetails extends PureComponent<Props> {
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
            <LastRunText>
              Last run:{' '}
              {moment(timeSinceStatusChange).format(
                'MMMM Do, YYYY [at] h:mm a'
              )}
            </LastRunText>
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
    }
  };

  render() {
    const {
      name,
      description,
      status,
      processId,
      command,
      timeSinceStatusChange,
      logs,
    } = this.props.task;

    const isRunning = !!processId;

    return (
      <Fragment>
        <Header>
          <PixelShifter y={-5}>
            <PixelShifter x={-1}>
              <Heading>{capitalize(name)}</Heading>
            </PixelShifter>
            <Description>{description}</Description>
          </PixelShifter>
          <Toggle isToggled={isRunning} onToggle={this.handleToggle} />
        </Header>

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
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 25px 25px 15px 25px;
  background: ${COLORS.gray[100]};
  border-radius: 8px 8px 0 0;
`;

const Description = styled.div`
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

const MainContent = styled.section`
  padding: 25px;
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
  task: getTaskById(ownProps.taskId, state),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(TaskDetails);
