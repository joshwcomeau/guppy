import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { initialize } from '../../actions';
import readLocalProjectsFromDisk from '../../services/read-local-projects.service';
import { getNumberOfProjects } from '../../reducers/projects.reducer';

import Home from '../Home';
import IntroScreen from '../IntroScreen';
import Sidebar from '../Sidebar';
import Titlebar from '../Titlebar';

class App extends Component {
  componentDidMount() {
    readLocalProjectsFromDisk()
      .then(this.props.initialize)
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { initializing, hasProjects } = this.props;

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
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  initializing: state.initializing,
  hasProjects: getNumberOfProjects(state) > 0,
});

export default connect(
  mapStateToProps,
  { initialize }
)(App);
