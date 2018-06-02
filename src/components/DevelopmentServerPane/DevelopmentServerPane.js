// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { externalLink } from 'react-icons-kit/feather/externalLink';
import { settings } from 'react-icons-kit/feather/settings';

import { runTask, abortTask } from '../../actions';
import { getSelectedProjectId } from '../../reducers/projects.reducer';
import { getTaskByProjectIdAndTaskName } from '../../reducers/tasks.reducer';
import { COLORS } from '../../constants';
import { capitalize } from '../../utils';

import Card from '../Card';
import Heading from '../Heading';
import Toggle from '../Toggle';
import TerminalOutput from '../TerminalOutput';
import Paragraph from '../Paragraph';
import ExternalLink from '../ExternalLink';
import LargeLED from '../LargeLED';
import Button from '../Button';
import Spacer from '../Spacer';

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

          <StatusWrapper>
            <LargeLED />
            <StatusTextWrapper>
              <Status>{capitalize(task.status)}</Status>
              <StatusCaption>
                {isRunning ? (
                  <ExternalLink
                    color={COLORS.gray[700]}
                    hoverColor={COLORS.gray[900]}
                    href="http://localhost:3000"
                  >
                    <IconLinkContents>
                      <IconBase icon={externalLink} />
                      <Spacer inline size={5} />
                      Open App
                    </IconLinkContents>
                  </ExternalLink>
                ) : (
                  <ExternalLink
                    color={COLORS.gray[700]}
                    hoverColor={COLORS.gray[900]}
                    href="http://localhost:3000"
                  >
                    <IconLinkContents>
                      <IconBase icon={settings} />
                      <Spacer inline size={5} />
                      Configure Server
                    </IconLinkContents>
                  </ExternalLink>
                )}
              </StatusCaption>
            </StatusTextWrapper>
          </StatusWrapper>

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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${COLORS.gray[200]};
  padding: 10px;
  margin: 20px 0;
  border-radius: 24px;
`;

const StatusTextWrapper = styled.div`
  position: relative;
  margin-left: 10px;
`;

const StatusCaption = styled.div`
  margin-top: 4px;
  font-size: 14px;
  font-weight: 400;
`;

const DocumentationLink = styled.div`
  line-height: 35px;
  text-align: center;
`;

const IconLinkContents = styled.div`
  display: flex;
  align-items: center;
`;

const Separator = styled.span`
  display: inline-block;
  width: 20px;
  text-align: center;
`;

const StatusLabel = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.gray[400]};
`;

const Status = styled.div`
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  -webkit-font-smoothing: antialiased;
  color: ${COLORS.gray[900]};
  line-height: 28px;
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
