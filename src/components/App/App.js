import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import Home from '../Home';

// TODO: Some way of redirecting to the most-recent project

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
      </Router>
    );
  }
}

export default App;
