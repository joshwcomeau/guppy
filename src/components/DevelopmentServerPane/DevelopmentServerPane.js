// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';

import Card from '../Card';
import Heading from '../Heading';
import Toggle from '../Toggle';
import TerminalOutput from '../TerminalOutput';
import Paragraph from '../Paragraph';
import LargeLED from '../LargeLED';

import type { Task } from '../../types';

type Props = {
  task: ?Task,
  runTask: (task: Task, timestamp: Date) => void,
  abortTask: (task: Task, timestamp: Date) => void,
};

class DevelopmentServerPane extends PureComponent<Props> {
  handleToggle = (isToggled: boolean) => {
    const { task, runTask, abortTask } = this.props;

    if (!task) {
      // Should be impossible, since the Toggle control won't render without
      // a "start" task.
      return;
    }

    const timestamp = new Date();

    if (isToggled) {
      runTask(task, timestamp);
    } else {
      abortTask(task, timestamp);
    }
  };

  render() {
    const { task } = this.props;

    console.log(task);

    if (!task) {
      // TODO: Helpful error screen
      return 'No "start" task found. :(';
    }

    const isRunning = task.status !== 'idle';

    return (
      <Wrapper>
        <LeftSide>
          <Header>
            <Heading>Dev Server</Heading>
            <Toggle isToggled={isRunning} onToggle={this.handleToggle} />
          </Header>
          <Description>
            Runs a local development server that updates whenever you make
            changes to the files.
          </Description>
          <LargeLED />
        </LeftSide>
        <RightSide>
          <TerminalOutput height={300} />
        </RightSide>
      </Wrapper>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;
`;

const LeftSide = styled.div`
  width: 300px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 1.125rem;
`;

const RightSide = styled.div`
  padding-left: 20px;
  flex: 1;
`;

const mapStateToProps = state => {
  const selectedProjectId = getSelectedProjectId(state);

  // For now, I'm assuming that the dev server task will be named `start`.
  // This is not universally true, not even for Gatsby projects! So this will
  // need to be customizable (or at least based on type).
  const taskName = 'start';

  return {
    task: getTaskByProjectIdAndTaskName(selectedProjectId, taskName, state),
  };
};

const mapDispatchToProps = { runTask, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevelopmentServerPane);
