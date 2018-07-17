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

// Set global styles
// NOTE: There are also baseline styles in `src/base.css`. These are just the
// subset that require variables.
injectGlobal`
  html,
  body,
  input,
  button,
  select,
  option {
    /* This is important for MacOS Mojave's dark mode */
    color: ${COLORS.gray[900]};
  }

  body {
    background: ${COLORS.gray[50]};
  }
`;

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
        </Fragment>
      </Router>
    </NodeProvider>
  </Provider>,
  root
);
