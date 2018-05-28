import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import configureStore from './store';
import { getInitialState } from './services/redux-persistence.service';

import App from './components/App';
import DevTools from './components/DevTools';

import './fonts.css';
import './base.css';

const initialState = getInitialState();

const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Fragment>
        <App />
        <DevTools />
      </Fragment>
    </Router>
  </Provider>,
  document.getElementById('root')
);
