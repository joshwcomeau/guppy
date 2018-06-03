// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTasksForProjectId } from '../../reducers/tasks.reducer';
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
                <TaskDescription>Run the automated test suite</TaskDescription>
              </NameColumn>

              <StatusColumn>
                <SmallLED />
                Watching
              </StatusColumn>

              <LinkColumn>
                <Button size="small">View Details</Button>
              </LinkColumn>

              <ActionsColumn>
                <Toggle size={24} />
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

const NameColumn = styled.div`
  width: 50%;
  display: flex;
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
  margin-left: 10px;
  color: ${COLORS.gray[500]};
`;

const StatusColumn = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
`;

const LinkColumn = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
`;

const ActionsColumn = styled.div`
  width: 10%;
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

  // For now, I'm assuming that the dev server task will be named `start`.
  // This is not universally true, not even for Gatsby projects! So this will
  // need to be customizable (or at least based on type).
  const taskName = 'start';

  return {
    tasks: getTasksForProjectId(selectedProjectId, state),
  };
};

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskRunnerPane);
