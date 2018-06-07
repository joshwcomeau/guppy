// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
import SquareStatus from '../SquareStatus';
import LargeLED from '../LargeLED';

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

        <Statuses>
          <SquareStatus width={150} label="Status" value="Idle">
            <LargeLED size={64} status="idle" />
          </SquareStatus>
          <SquareStatus width={150} label="Status" value="Idle">
            <IconBase icon={hourglass} size={64} />
          </SquareStatus>
          <SquareStatus width={150} label="Status" value="Idle">
            <IconBase icon={clock} size={64} />
          </SquareStatus>
        </Statuses>
      </Fragment>
    );
  }
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 25px;
  background: ${COLORS.gray[100]};
  border-radius: 8px 8px 0 0;
`;

const Description = styled.div`
  margin-bottom: 15px;
  font-size: 24px;
  color: ${COLORS.gray[600]};
`;

const Statuses = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: -15px;
  margin-bottom: 30px;
`;

const mapStateToProps = (state, ownProps) => ({
  task: getTaskById(ownProps.taskId, state),
});

export default connect(
  mapStateToProps,
  { runTask, abortTask }
)(TaskDetails);
