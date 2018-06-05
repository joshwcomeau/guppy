// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u1F44C as successIcon } from 'react-icons-kit/noto_emoji_regular/u1F44C';
import { u1F319 as idleIcon } from 'react-icons-kit/noto_emoji_regular/u1F319';
import { u274C as failIcon } from 'react-icons-kit/noto_emoji_regular/u274C';
import { ic_eject as ejectIcon } from 'react-icons-kit/md/ic_eject';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTasksInTaskListForProjectId } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import Module from '../Module';
import TerminalOutput from '../TerminalOutput';
import Heading from '../Heading';
import Card from '../Card';
import SmallLED from '../SmallLED';
import Spinner from '../Spinner';
import BigClickableButton from '../BigClickableButton';
import Button from '../Button';
import Toggle from '../Toggle';

import type { Task, TaskStatus } from '../../types';

type Props = {
  tasks: Array<Task>,
  runTask: Function,
  abortTask: Function,
};

class TaskRunnerPane extends PureComponent<Props> {
  handleToggleTask = task => {
    const { runTask, abortTask } = this.props;

    const isRunning = !!task.processId;

    const timestamp = new Date();

    isRunning ? abortTask(task, timestamp) : runTask(task, timestamp);
  };

  renderTaskRow = task => (
    <TaskCard key={task.id}>
      <NameColumn>
        <TaskName>{capitalize(task.name)}</TaskName>
        <TaskDescription>{task.description}</TaskDescription>
      </NameColumn>

      <StatusColumn>
        {getIconForStatus(task.status)}
        <TaskStatusLabel>{capitalize(task.status)}</TaskStatusLabel>
      </StatusColumn>

      <LinkColumn>
        <Button size="small">View Details</Button>
      </LinkColumn>

      <ActionsColumn>
        {task.name === 'eject' ? (
          <BigClickableButton
            width={40}
            height={34}
            colors={[COLORS.purple[500], COLORS.blue[700]]}
          >
            <IconBase size={24} icon={ejectIcon} />
          </BigClickableButton>
        ) : (
          <Toggle
            size={24}
            isToggled={!!task.processId}
            onToggle={() => this.handleToggleTask(task)}
          />
        )}
      </ActionsColumn>
    </TaskCard>
  );

  render() {
    const { tasks } = this.props;

    return (
      <Module title="Tasks">
        <Wrapper>{tasks.map(this.renderTaskRow)}</Wrapper>
      </Module>
    );
  }
}

const getIconForStatus = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return <Spinner size={18} />;
    case 'success':
      return (
        <IconBase
          size={21}
          icon={successIcon}
          style={{ color: COLORS.green[700] }}
        />
      );
    case 'failed':
      return (
        <IconBase
          size={18}
          icon={failIcon}
          style={{ color: COLORS.red[500] }}
        />
      );
    default:
      return (
        <IconBase
          size={21}
          icon={idleIcon}
          style={{ color: COLORS.gray[400], transform: 'translateY(-2px)' }}
        />
      );
  }
};

const Wrapper = styled.div``;

const TaskCard = Card.extend`
  display: flex;
  margin-bottom: 10px;
  padding: 12px 24px;
`;

const Column = styled.div`
  margin-right: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:last-child {
    margin-right: 0;
  }
`;

const NameColumn = Column.extend`
  flex: 1;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  line-height: 48px;
`;

const TaskName = styled.span`
  font-weight: 500;
  color: ${COLORS.gray[900]};
`;

const TaskDescription = styled.span`
  font-weight: 400;
  margin-left: 15px;
  color: ${COLORS.gray[500]};
`;

const StatusColumn = Column.extend`
  width: 150px;
  display: flex;
  align-items: center;
`;

const TaskStatusLabel = styled.span`
  display: inline-block;
  width: 22px;
  margin-left: 8px;
`;

const LinkColumn = Column.extend`
  width: 115px;
  padding-left: 2px;
  display: flex;
  align-items: center;
`;

const ActionsColumn = Column.extend`
  width: 70px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Link = styled.div`
  color: ${COLORS.blue[700]};
  text-decoration: underline;
`;

const mapStateToProps = state => {
  const selectedProjectId = getSelectedProjectId(state);

  const tasks = selectedProjectId
    ? getTasksInTaskListForProjectId(selectedProjectId, state)
    : [];

  return { tasks };
};

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskRunnerPane);
