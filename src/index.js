import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import { getInitialState } from './helpers/local-storage.helpers';
import configureStore from './store';

import App from './components/App';
import DevTools from './components/DevTools';

const store = configureStore(getInitialState());

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
