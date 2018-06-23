// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { launchDevServer, abortTask } from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getDevServerTaskForProjectId } from '../../reducers/tasks.reducer';
import { getDocumentationLink } from '../../services/project-type-specifics';
import { BREAKPOINTS } from '../../constants';

import Module from '../Module';
import Card from '../Card';
import Toggle from '../Toggle';
import Spacer from '../Spacer';
import TerminalOutput from '../TerminalOutput';
import ExternalLink from '../ExternalLink';
import OnlyOn from '../OnlyOn';
import DevelopmentServerStatus from '../DevelopmentServerStatus';

import type { Project, Task } from '../../types';

type Props = {
  project: Project,
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
    const { project, task } = this.props;

    if (!task) {
      // This can happen if the user modifies the package.json to not have a
      // script named `start` (or `deploy` for Gatsby projects)
      // TODO: Helpful error screen
      return 'No "start" task found. :(';
    }

    // TODO: There's currently no DevelopmentServerStatus for smaller windows.
    // Create a custom component for windows <900px wide

    const isRunning = task.status !== 'idle';

    const description = (
      <Description>
        Runs a local development server that updates whenever you make changes
        to the files.
      </Description>
    );

    const docLink = (
      <DocumentationLink>
        <ExternalLink href={getDocumentationLink(project.type)}>
          View Documentation
        </ExternalLink>
      </DocumentationLink>
    );

    return (
      <Module
        title="Development Server"
        primaryActionChildren={
          <Toggle isToggled={isRunning} onToggle={this.handleToggle} />
        }
      >
        <OnlyOn size="mdMin">
          <Wrapper>
            <InfoWrapper>
              {description}
              <DevelopmentServerStatus status={task.status} port={task.port} />
              {docLink}
            </InfoWrapper>
            <TerminalWrapper>
              <TerminalOutput height={300} logs={task.logs} />
            </TerminalWrapper>
          </Wrapper>
        </OnlyOn>

        <OnlyOn size="sm">
          <Wrapper>
            <InfoWrapper>
              <SmallInfoWrapper>
                {description}
                <Spacer size={10} />
                {docLink}
              </SmallInfoWrapper>
            </InfoWrapper>
            <TerminalWrapper>
              <TerminalOutput height={300} logs={task.logs} />
            </TerminalWrapper>
          </Wrapper>
        </OnlyOn>
      </Module>
    );
  }
}

const Wrapper = Card.extend`
  display: flex;

  @media ${BREAKPOINTS.sm} {
    flex-direction: column;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${BREAKPOINTS.sm} {
    flex-direction: row;
  }

  @media ${BREAKPOINTS.mdMin} {
    flex: 6;
  }
`;

const SmallInfoWrapper = styled.div`
  display: block;
  padding-bottom: 12px;
`;

const DocumentationLink = styled.div`
  @media ${BREAKPOINTS.mdMin} {
    line-height: 35px;
    text-align: center;
  }
`;

const Description = styled.div`
  font-size: 1.125rem;
`;

const TerminalWrapper = styled.div`
  overflow: auto;

  @media ${BREAKPOINTS.mdMin} {
    flex: 11;
    padding-left: 20px;
  }
`;

const mapStateToProps = state => {
  const selectedProject = getSelectedProject(state);

  if (!selectedProject) {
    return { task: null };
  }

  return {
    project: selectedProject,
    task: getDevServerTaskForProjectId(
      selectedProject.id,
      selectedProject.type,
      state
    ),
  };
};

const mapDispatchToProps = { launchDevServer, abortTask };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevelopmentServerPane);
