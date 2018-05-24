import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { initialize } from '../../actions';
import readLocalProjectsFromDisk from '../../services/read-local-projects.service';

import Home from '../Home';

class App extends Component {
  componentDidMount() {
    readLocalProjectsFromDisk()
      .then(this.props.initialize)
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    if (this.props.initializing) {
      // NOTE: Originally I was gonna put a fancy loading screen here.
      // It seems like it takes like 50ms to load, though, and so rendering
      // anything is just this awkward flash of content.
      return null;
    }

    return <Route exact path="/" component={Home} />;
  }
}

const mapStateToProps = state => ({
  initializing: state.initializing,
});

export default connect(mapStateToProps, { initialize })(App);
