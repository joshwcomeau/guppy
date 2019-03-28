// @flow
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store';

import App from './components/App';
import GlobalStyles from './components/GlobalStyles';
import NodeProvider from './components/NodeProvider';
import DevTools from './components/DevTools';

const store = configureStore();

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing root container');
}

ReactDOM.render(
  <Provider store={store}>
    <NodeProvider>
      <Fragment>
        <GlobalStyles />
        <App />
        <DevTools />
      </Fragment>
    </NodeProvider>
  </Provider>,
  root
);
