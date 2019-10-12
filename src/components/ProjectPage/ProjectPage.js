// @flow
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import IconBase from 'react-icons-kit';
import { packageIcon } from 'react-icons-kit/feather/packageIcon';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { getDependenciesLoadingStatus } from '../../reducers/dependencies.reducer';
import { RAW_COLORS, COLORS, GRADIENTS } from '../../constants';
import * as actions from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';
import SettingsButton from '../SettingsButton';
import Paragraph from '../Paragraph';
import MountAfter from '../MountAfter';
import Spinner from '../Spinner';
import Card from '../Card';
import ProjectTitle from '../ProjectTitle';

import {
  openProjectInEditor,
  openProjectInFolder,
} from '../../services/shell.service';
import { getCopyForOpeningFolder } from '../../services/platform.service';

import type { Project } from '../../types';

type Props = {
  project: Project,
  dependenciesLoadingStatus: string,
  loadDependencyInfoFromDisk: Dispatch<
    typeof actions.loadDependencyInfoFromDiskStart
  >,
  reinstallDependencies: Dispatch<typeof actions.reinstallDependenciesStart>,
};

export class ProjectPage extends PureComponent<Props> {
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
    const { project } = this.props;
    if (project.id !== nextProps.project.id) {
      this.props.loadDependencyInfoFromDisk(
        nextProps.project.id,
        nextProps.project.path
      );
    }
  }

  renderConditionally = () => {
    const {
      project,
      reinstallDependencies,
      dependenciesLoadingStatus,
    } = this.props;
    // Conditionally render depending on dependenciesLoadingStatus
    return {
      loading: (
        <MountAfter
          delay={100}
          reason={`Don't show spinner if we're really fast.`}
        >
          <SpinnerWrapper>
            <Spinner size={50} />
          </SpinnerWrapper>
        </MountAfter>
      ),
      done: (
        <Fragment>
          <DevelopmentServerPane leftSideWidth={300} />

          <Spacer size={30} />
          <TaskRunnerPane leftSideWidth={200} />
          <Spacer size={30} />
          <DependencyManagementPane />
        </Fragment>
      ),
      fail: (
        <Card>
          <BaseWrapper>
            <DependencyMissingIcon />
          </BaseWrapper>

          <Paragraph>
            <strong>Oh no!</strong> Looks like your project dependencies are
            missing.
          </Paragraph>
          <Paragraph>
            This can happen if you've freshly cloned a project from GitHub. In
            order to run scripts in Guppy, you'll need to install them now.
          </Paragraph>
          <Spacer size={30} />
          <InstallWrapper>
            <FillButton
              size="large"
              colors={GRADIENTS.success}
              onClick={() => reinstallDependencies(project.id)}
            >
              Install Dependencies
            </FillButton>
          </InstallWrapper>
        </Card>
      ),
    }[dependenciesLoadingStatus];
  };

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
              <ProjectTitle
                tooltip={path}
                title={project.name}
                projectType={project.type}
              />
            </PixelShifter>
            <SettingsButton />
          </FlexRow>

          <ProjectActionBar>
            <FillButton
              colors={RAW_COLORS.gray[200]}
              hoverColors={RAW_COLORS.gray[300]}
              textColor={COLORS.text}
              size="small"
              onClick={this.openFolder}
            >
              {getCopyForOpeningFolder()}
            </FillButton>
            <Spacer size={15} />
            <FillButton
              colors={RAW_COLORS.gray[200]}
              hoverColors={RAW_COLORS.gray[300]}
              textColor={COLORS.text}
              size="small"
              onClick={this.openIDE}
            >
              Open in Editor
            </FillButton>
          </ProjectActionBar>

          <Spacer size={30} />
          {this.renderConditionally()}
          <Spacer size={60} />
        </MainContentWrapper>
      </FadeIn>
    );
  }
}

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectActionBar = styled.div`
  display: flex;
`;

const BaseWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InstallWrapper = styled(BaseWrapper)``;
const SpinnerWrapper = styled(BaseWrapper)``;

const DependencyMissingIcon = styled(IconBase).attrs({
  icon: packageIcon,
  size: 100,
})`
  color: ${RAW_COLORS.gray[300]};
  padding: 30px;
`;

const fadeIn = keyframes`
  from { opacity: 0.5 }
  to { opacity: 1 }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 400ms;
`;

const mapStateToProps = state => {
  const project = getSelectedProject(state);
  const props = {
    projectId: project && project.id,
  };

  return {
    project,
    dependenciesLoadingStatus: getDependenciesLoadingStatus(state, props),
  };
};

export default connect(
  mapStateToProps,
  {
    loadDependencyInfoFromDisk: actions.loadDependencyInfoFromDiskStart,
    reinstallDependencies: actions.reinstallDependenciesStart,
  }
)(ProjectPage);
