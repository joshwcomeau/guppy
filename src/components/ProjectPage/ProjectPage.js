// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { COLORS } from '../../constants';
import * as actions from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import Button from '../Button';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';
import {
  openProjectInEditor,
  openProjectInFolder,
} from '../../services/shell.service';
import { getCopyForOpeningFolder } from '../../services/platform.service';

import type { Project } from '../../types';

type Props = {
  project: Project,
  loadDependencyInfoFromDisk: (projectId: string, projectPath: string) => any,
};

class ProjectPage extends Component<Props> {
  openIDE = () => {
    const { project } = this.props;
    openProjectInEditor(project);
  };

  openFolder = () => {
    const { project } = this.props;
    // Show a folder in the file manager
    openProjectInFolder(project);
  };

  componentDidMount() {
    const { project, loadDependencyInfoFromDisk } = this.props;

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    loadDependencyInfoFromDisk(project.id, project.path);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.project.id !== nextProps.project.id) {
      this.props.loadDependencyInfoFromDisk(
        nextProps.project.id,
        nextProps.project.path
      );
    }
  }

  render() {
    const { project } = this.props;

    return (
      <FadeIn>
        <MainContentWrapper>
          <PixelShifter
            x={-2}
            reason="Align left edge of title with the modules on page"
          >
            <Heading size="xlarge" style={{ color: COLORS.purple[500] }}>
              {project.name}
            </Heading>
          </PixelShifter>

          <ProjectActionBar>
            <Button
              type="fill"
              color1={COLORS.gray[200]}
              color2={COLORS.gray[200]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openFolder}
            >
              {getCopyForOpeningFolder()}
            </Button>
            <Spacer size={15} />
            <Button
              type="fill"
              color1={COLORS.gray[200]}
              color2={COLORS.gray[200]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openIDE}
            >
              Open in Editor
            </Button>
          </ProjectActionBar>

          <Spacer size={30} />
          <DevelopmentServerPane leftSideWidth={300} />

          <Spacer size={30} />
          <TaskRunnerPane leftSideWidth={200} />

          {project.dependencies.length > 0 && (
            <Fragment>
              <Spacer size={30} />
              <DependencyManagementPane />
            </Fragment>
          )}

          <Spacer size={60} />
        </MainContentWrapper>
      </FadeIn>
    );
  }
}

const ProjectActionBar = styled.div`
  display: flex;
`;

const fadeIn = keyframes`
  from { opacity: 0.5 }
  to { opacity: 1 }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 400ms;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(
  mapStateToProps,
  { loadDependencyInfoFromDisk: actions.loadDependencyInfoFromDisk }
)(ProjectPage);
