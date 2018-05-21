import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Home from '../Home';

// TODO: Some way of redirecting to the most-recent project?

class App extends Component {
  render() {
    return <Route exact path="/" component={Home} />;
  }
}

export default App;
