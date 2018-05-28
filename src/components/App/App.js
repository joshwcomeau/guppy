// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import { initialize } from '../../actions';
import readLocalProjectsFromDisk from '../../services/read-local-projects.service';
import { getProjectsArray } from '../../reducers/projects.reducer';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

import Home from '../Home';
import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';
import ProjectPage from '../ProjectPage';

import type { Action } from 'redux';
import type { Project } from '../../types';
import type { State as OnboardingStatus } from '../../reducers/onboarding-status.reducer';

type Props = {
  initializing: boolean,
  initialize: Action,
  onboardingStatus: OnboardingStatus,
  projects: Array<Project>,
  history: any, // Provided by `withRouter`
};

class App extends Component<Props> {
  componentDidMount() {
    readLocalProjectsFromDisk()
      .then(this.props.initialize)
      .catch(err => {
        console.error(err);
      });
  }

  componentWillReceiveProps(nextProps) {
    // It is expected that the user will only have 1 project at this point.
    // If, somehow, they have two... it would be bad to accidentally send
    // them to the wrong one. In this case, we'll let them click it from
    // the projects sidebar.
    const only1Project = nextProps.projects.length === 1;

    console.log(
      { only1Project },
      this.props.onboardingStatus,
      nextProps.onboardingStatus
    );

    if (
      only1Project &&
      this.props.onboardingStatus !== 'done' &&
      nextProps.onboardingStatus === 'done'
    ) {
      this.forwardToProject(nextProps.projects[0]);
    }
  }

  forwardToProject = project => {
    this.props.history.push(`/project/${project.id}`);
  };

  render() {
    const { initializing } = this.props;

    if (initializing) {
      // NOTE: Originally I was gonna put a fancy loading screen here.
      // It seems like it takes like 50ms to load, though, and so rendering
      // anything is just this awkward flash of content.
      return null;
    }

    // const DefaultComponent = hasProjects ? Home : IntroScreen;
    const DefaultComponent = IntroScreen; // TEMP

    return (
      <Fragment>
        <Titlebar />
        <Sidebar />
        <Route exact path="/" component={DefaultComponent} />
        <Route path="/project/:projectId" component={ProjectPage} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  initializing: state.initializing,
  onboardingStatus: getOnboardingStatus(state),
  projects: getProjectsArray(state),
});

export default withRouter(
  connect(
    mapStateToProps,
    { initialize }
  )(App)
);
