// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { getSelectedProject } from '../../reducers/projects.reducer';
import { extractProjectTabFromUrl } from '../../services/location.service';
import { COLORS } from '../../constants';
import { loadDependencyInfoFromDisk } from '../../actions';

import MainContentWrapper from '../MainContentWrapper';
import Heading from '../Heading';
import PixelShifter from '../PixelShifter';
import Spacer from '../Spacer';
import DevelopmentServerPane from '../DevelopmentServerPane';
import TaskRunnerPane from '../TaskRunnerPane';
import DependencyManagementPane from '../DependencyManagementPane';

import type { Project } from '../../types';

type Props = {
  project: Project,
  loadDependencyInfoFromDisk: (project: Project) => any,
  location: any, // provided by react-router
  match: any, // provided by react-router
};

class ProjectPage extends Component<Props> {
  componentDidMount() {
    this.getDependencyInfo();
  }

  getDependencyInfo() {
    const { loadDependencyInfoFromDisk, project } = this.props;

    loadDependencyInfoFromDisk(project);
  }

  render() {
    const { project, location, match } = this.props;

    const projectIdFromUrl = match.params.projectId;
    const projectTabFromUrl = extractProjectTabFromUrl(location) || 'tasks';

    if (!project) {
      return null;
    }

    return (
      <FadeIn>
        <MainContentWrapper>
          <PixelShifter x={-2}>
            <Heading size="xlarge" style={{ color: COLORS.purple[500] }}>
              {project.name}
            </Heading>
          </PixelShifter>

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

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 1000ms;
`;

const mapStateToProps = state => ({
  project: getSelectedProject(state),
});

export default connect(
  mapStateToProps,
  { loadDependencyInfoFromDisk }
)(ProjectPage);
