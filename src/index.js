import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { injectGlobal } from 'styled-components';

import configureStore from './store';

import App from './components/App';
import DevTools from './components/DevTools';

import './fonts.css';
import './base.css';

const store = configureStore({ initializing: true });

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
