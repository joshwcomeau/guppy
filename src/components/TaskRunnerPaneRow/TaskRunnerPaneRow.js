// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u1F44C as successIcon } from 'react-icons-kit/noto_emoji_regular/u1F44C';
import { u1F31B as idleIcon } from 'react-icons-kit/noto_emoji_regular/u1F31B';
import { u274C as failIcon } from 'react-icons-kit/noto_emoji_regular/u274C';

import { COLORS, BREAKPOINTS } from '../../constants';
import { capitalize } from '../../utils';

import Card from '../Card';
import Spinner from '../Spinner';
import { StrokeButton } from '../Button';
import EjectButton from '../EjectButton';
import Toggle from '../Toggle';

import type { TaskStatus } from '../../types';

type Props = {
  name: string,
  description: string,
  status: TaskStatus,
  processId?: number,
  isDisabled: boolean,
  onToggleTask: (taskId: string) => void,
  onViewDetails: (taskId: string) => void,
};

class TaskRunnerPaneRow extends PureComponent<Props> {
  render() {
    const {
      name,
      description,
      status,
      processId,
      isDisabled,
      onToggleTask,
      onViewDetails,
    } = this.props;

    return (
      <TaskCard>
        <NameColumn>
          <TaskName>{capitalize(name)}</TaskName>
          <TaskDescription>{description}</TaskDescription>
        </NameColumn>

        <StatusColumn>
          {getIconForStatus(status)}
          <TaskStatusLabel>{capitalize(status)}</TaskStatusLabel>
        </StatusColumn>

        <LinkColumn>
          {name === 'eject' ? null : (
            <StrokeButton size="small" onClick={() => onViewDetails(name)}>
              View Details
            </StrokeButton>
          )}
        </LinkColumn>

        <ActionsColumn>
          {name === 'eject' ? (
            <EjectButton
              width={40}
              height={34}
              isRunning={!!processId}
              disabled={isDisabled}
              onClick={() => onToggleTask(name)}
            />
          ) : (
            <Toggle
              size={24}
              isToggled={!!processId}
              isDisabled={isDisabled}
              onToggle={() => onToggleTask(name)}
            />
          )}
        </ActionsColumn>
      </TaskCard>
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

  @media ${BREAKPOINTS.sm} {
    display: none;
  }
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

export default TaskRunnerPaneRow;
