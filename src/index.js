import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import configureStore from './store';
import { getInitialState } from './services/redux-persistence.service';

import App from './components/App';
import NodeProvider from './components/NodeProvider';
import DevTools from './components/DevTools';

import 'react-tippy/dist/tippy.css';
import './fonts.css';
import './base.css';

// TODO: I'm told that this is required to build mac apps, but enabling it
// throws an error for me :/
// const fixPath = require('fix-path');
// fixPath();

const initialState = getInitialState();

const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>
    <NodeProvider>
      <Router>
        <Fragment>
          <App />
          <DevTools />
        </Fragment>
      </Router>
    </NodeProvider>
  </Provider>,
  document.getElementById('root')
);
