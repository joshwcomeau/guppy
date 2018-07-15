import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import configureStore from './store';
import { getInitialState } from './services/redux-persistence.service';

import App from './components/App';
import NodeProvider from './components/NodeProvider';
import DevTools from './components/DevTools';

import { injectGlobal } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import { COLORS } from './constants';
import './fonts.css';
import './base.css';

const initialState = getInitialState();

const store = configureStore(initialState);

const root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <NodeProvider>
      <Router>
        <Fragment>
          <App />
          <DevTools />
        </Fragment>{' '}
      </Router>{' '}
    </NodeProvider>{' '}
  </Provider>,
  root
);

injectGlobal`
  html,
  body,
  input,
  button,
  select,
  option {
    color: ${COLORS.gray[900]};
    font-family: 'Futura PT';
  }

  body {
    background: ${COLORS.gray[50]};
    color: ${COLORS.gray[900]};
  }
`;
