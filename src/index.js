import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store';

import App from './components/App';
import NodeProvider from './components/NodeProvider';
import DevTools from './components/DevTools';

import './global-styles';

const store = configureStore();

const root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <NodeProvider>
      <Fragment>
        <App />
        <DevTools />
      </Fragment>
    </NodeProvider>
  </Provider>,
  root
);
