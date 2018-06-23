// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { refreshProjects, selectProject, closeGuppy } from '../../actions';
import {
  extractProjectIdFromUrl,
  buildUrlForProjectId,
} from '../../services/location.service';
import {
  getProjectsArray,
  getSelectedProject,
} from '../../reducers/projects.reducer';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ProjectPage from '../ProjectPage';
import CreateNewProjectWizard from '../CreateNewProjectWizard';

import type { Action } from 'redux';
import type { Project, Task } from '../../types';
import type { State as OnboardingStatus } from '../../reducers/onboarding-status.reducer';

const { app } = window.require('electron').remote;

type Props = {
  onboardingStatus: OnboardingStatus,
  selectedProject: ?Project,
  projects: Array<Project>,
  refreshProjects: Action,
  selectProject: Action,
  closeGuppy: () => any,
  history: any, // Provided by `withRouter`
};

class App extends Component<Props> {
  componentDidMount() {
    const {
      history,
      selectedProject,
      selectProject,
      refreshProjects,
      closeGuppy,
    } = this.props;

    refreshProjects();

    // TODO: Redirect if project exists
    if (selectedProject) {
      history.replace(buildUrlForProjectId(selectedProject.id));
    }

    history.listen(location => {
      const projectId = extractProjectIdFromUrl(location);

      if (projectId) {
        selectProject(projectId);
      }
    });

    app.on('will-quit', ev => {
      alert('WILL-QUIT');
      ev.preventDefault();

      closeGuppy();
    });

    app.on('quit', ev => {
      alert('QUIT');
    });

    app.on('window-all-closed', ev => {
      alert('WINDW ALL CLOSD');
      console.log('closed');
    });
  }

  render() {
    console.log('running', this.props.runningTasks);
    return (
      <Fragment>
        <Titlebar />

        <Wrapper>
          <Sidebar />

          <MainContent>
            <Switch>
              <Route exact path="/" component={IntroScreen} />
              <Route
                path="/project/:projectId"
                render={routerProps => (
                  <ProjectPage
                    key={routerProps.match.params.projectId}
                    {...routerProps}
                  />
                )}
              />
            </Switch>
          </MainContent>
        </Wrapper>

        <CreateNewProjectWizard />
      </Fragment>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
`;

const MainContent = styled.div`
  position: relative;
  min-height: 100vh;
  flex: 1;
`;

const mapStateToProps = state => ({
  onboardingStatus: getOnboardingStatus(state),
  projects: getProjectsArray(state),
  selectedProject: getSelectedProject(state),
});

export default withRouter(
  connect(
    mapStateToProps,
    { refreshProjects, selectProject, closeGuppy }
  )(App)
);
