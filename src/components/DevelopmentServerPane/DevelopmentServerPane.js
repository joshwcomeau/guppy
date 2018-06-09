// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { launchDevServer, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getDevServerTaskForProjectId } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import Module from '../Module';
import Card from '../Card';
import Heading from '../Heading';
import Toggle from '../Toggle';
import TerminalOutput from '../TerminalOutput';
import Paragraph from '../Paragraph';
import ExternalLink from '../ExternalLink';
import DevelopmentServerStatus from '../DevelopmentServerStatus';

import type { Task } from '../../types';

type Props = {
  task: ?Task,
  launchDevServer: (task: Task, timestamp: Date) => void,
  abortTask: (task: Task, timestamp: Date) => void,
};

class DevelopmentServerPane extends PureComponent<Props> {
  handleToggle = (isToggled: boolean) => {
    const { task, launchDevServer, abortTask } = this.props;

    if (!task) {
      // Should be impossible, since the Toggle control won't render without
      // a "start" task.
      return;
    }

    const timestamp = new Date();

    if (isToggled) {
      launchDevServer(task, timestamp);
    } else {
      abortTask(task, timestamp);
    }
  };

  render() {
    const { task } = this.props;

    if (!task) {
      // TODO: Helpful error screen
      return 'No "start" task found. :(';
    }

    const isRunning = task.status !== 'idle';

    return (
      <Module
        title="Development Server"
        primaryActionChildren={
          <Toggle isToggled={isRunning} onToggle={this.handleToggle} />
        }
      >
        <Wrapper>
          <LeftSide>
            <Description>
              Runs a local development server that updates whenever you make
              changes to the files.
            </Description>

            <DevelopmentServerStatus status={task.status} />

            <DocumentationLink>
              <ExternalLink
                color={COLORS.blue[700]}
                hoverColor={COLORS.blue[500]}
                href="https://github.com/facebook/create-react-app#user-guide"
              >
                View Documentation
              </ExternalLink>
            </DocumentationLink>
          </LeftSide>
          <RightSide>
            <TerminalOutput height={300} width={550} logs={task.logs} />
          </RightSide>
        </Wrapper>
      </Module>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;
`;

const LeftSide = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DocumentationLink = styled.div`
  line-height: 35px;
  text-align: center;
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

  if (!selectedProjectId) {
    return { task: null };
  }

  return {
    task: getDevServerTaskForProjectId(selectedProjectId, state),
  };
};

const mapDispatchToProps = { launchDevServer, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevelopmentServerPane);
