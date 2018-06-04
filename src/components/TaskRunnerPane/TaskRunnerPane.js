// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u1F4A3 as bombIcon } from 'react-icons-kit/noto_emoji_regular/u1F4A3';

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
import BigClickableButton from '../BigClickableButton';
import Button from '../Button';
import Toggle from '../Toggle';

import type { Task } from '../../types';

type Props = {
  tasks: Array<Task>,
};

class TaskRunnerPane extends PureComponent<Props> {
  render() {
    const { tasks } = this.props;

    return (
      <Module title="Tasks" primaryActionChildren={'Action'}>
        <Wrapper>
          {tasks.map(task => (
            <TaskCard>
              <NameColumn>
                <TaskName>{capitalize(task.taskName)}</TaskName>
                <TaskDescription>{task.description}</TaskDescription>
              </NameColumn>

              <StatusColumn>
                <SmallLED />
                Watching
              </StatusColumn>

              <LinkColumn>
                <Button size="small">View Details</Button>
              </LinkColumn>

              <ActionsColumn>
                {task.isDestructiveTask ? (
                  <BigClickableButton
                    width={40}
                    height={34}
                    colors={[COLORS.red[500], COLORS.pink[300]]}
                  >
                    <IconBase size={24} icon={bombIcon} />
                  </BigClickableButton>
                ) : (
                  <Toggle size={24} />
                )}
              </ActionsColumn>
            </TaskCard>
          ))}
        </Wrapper>
      </Module>
    );
  }
}

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

  console.log(selectedProjectId, tasks);

  return { tasks };
};

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskRunnerPane);
