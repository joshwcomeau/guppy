// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';

import * as actions from '../../actions';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getDevServerTaskForProjectId } from '../../reducers/tasks.reducer';
import { getDocumentationLink } from '../../services/project-type-specifics';
import { BREAKPOINTS, GUPPY_REPO_URL } from '../../constants';

import Module from '../Module';
import Card from '../Card';
import Toggle from '../Toggle';
import Spacer from '../Spacer';
import TerminalOutput from '../TerminalOutput';
import ExternalLink from '../ExternalLink';
import DevelopmentServerStatus from '../DevelopmentServerStatus';

import type { Project, Task } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  project: Project,
  task: ?Task,
  launchDevServer: Dispatch<typeof actions.launchDevServer>,
  abortTask: Dispatch<typeof actions.abortTask>,
};

export class DevelopmentServerPane extends PureComponent<Props> {
  handleToggle = (isToggled: boolean) => {
    const { task, launchDevServer, abortTask, project } = this.props;

    if (!task) {
      // Should be impossible, since the Toggle control won't render without
      // a "start" task.
      return;
    }

    const timestamp = new Date();

    if (isToggled) {
      launchDevServer(task, timestamp);
    } else {
      abortTask(task, project.type, timestamp);
    }
  };

  render() {
    const { project, task } = this.props;

    if (!task) {
      // If the package.json is missing a server task (as defined by the
      // `getDevServerTaskForProjectId` selector), we can't show this module.
      // TODO: Better errors
      return 'This project does not appear to have a development server task';
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

    const terminal = (
      <TerminalWrapper>
        <TerminalOutput height={300} title="Server Logs" task={task} />
      </TerminalWrapper>
    );

    return (
      <Module
        title="Development Server"
        moreInfoHref={`${GUPPY_REPO_URL}/blob/master/docs/getting-started.md#development-server`}
        primaryActionChildren={
          <Toggle isToggled={isRunning} onToggle={this.handleToggle} />
        }
      >
        <MediaQuery query={BREAKPOINTS['mdMin']}>
          {matches =>
            matches ? (
              <Wrapper>
                <InfoWrapper>
                  {description}
                  <DevelopmentServerStatus
                    status={task.status}
                    port={task.port}
                  />
                  {docLink}
                </InfoWrapper>
                {terminal}
              </Wrapper>
            ) : (
              <Wrapper>
                <InfoWrapper>
                  <SmallInfoWrapper>
                    {description}
                    <Spacer size={10} />
                    {docLink}
                  </SmallInfoWrapper>
                </InfoWrapper>
                {terminal}
              </Wrapper>
            )
          }
        </MediaQuery>
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
  @media ${BREAKPOINTS.mdMin} {
    flex: 11;
    padding-left: 20px;
    /*
      overflow: hidden is needed so that the column won't expand when the
      terminal output is really long. This way, it will be scrollable.
    */
    overflow: hidden;
    /* Offset by the Card padding amount. */
    margin-top: -15px;
  }
`;

const mapStateToProps = state => {
  const selectedProject = getSelectedProject(state);

  if (!selectedProject) {
    return { task: null };
  }

  return {
    project: selectedProject,
    task: getDevServerTaskForProjectId(state, {
      projectId: selectedProject.id,
      projectType: selectedProject.type,
    }),
  };
};

const mapDispatchToProps = {
  launchDevServer: actions.launchDevServer,
  abortTask: actions.abortTask,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevelopmentServerPane);
