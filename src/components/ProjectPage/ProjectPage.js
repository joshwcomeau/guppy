// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Tooltip } from 'react-tippy';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { COLORS } from '../../constants';
import * as actions from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';
import SettingsButton from '../SettingsButton';
import {
  openProjectInEditor,
  openProjectInFolder,
} from '../../services/shell.service';
import { getCopyForOpeningFolder } from '../../services/platform.service';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  project: Project,
  loadDependencyInfoFromDisk: Dispatch<
    typeof actions.loadDependencyInfoFromDiskStart
  >,
};

class ProjectPage extends PureComponent<Props> {
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
    const { path } = project;

    return (
      <FadeIn>
        <MainContentWrapper>
          <FlexRow>
            <PixelShifter
              x={-2}
              reason="Align left edge of title with the modules on page"
            >
              <Tooltip title={path} position="bottom">
                <Heading size="xlarge" style={{ color: COLORS.purple[500] }}>
                  {project.name}
                </Heading>
              </Tooltip>
            </PixelShifter>
            <SettingsButton />
          </FlexRow>

          <ProjectActionBar>
            <FillButton
              colors={COLORS.gray[200]}
              hoverColors={COLORS.gray[300]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openFolder}
            >
              {getCopyForOpeningFolder()}
            </FillButton>
            <Spacer size={15} />
            <FillButton
              colors={COLORS.gray[200]}
              hoverColors={COLORS.gray[300]}
              textColor={COLORS.gray[900]}
              size="small"
              onClick={this.openIDE}
            >
              Open in Editor
            </FillButton>
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

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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
  {
    loadDependencyInfoFromDisk: actions.loadDependencyInfoFromDiskStart,
  }
)(ProjectPage);
