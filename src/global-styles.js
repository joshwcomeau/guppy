// @flow
import { injectGlobal } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { COLORS } from './constants';
import './fonts.css';
import './base.css';

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

  /* Modify top position of React-Redux-Toastr so it's closer to the upper edge - was top: 20% */
  div .rrt-confirm-holder .rrt-confirm {
    top: 5%;
    width: 70vw;
    margin-left: 15vw;
    left: 0;
  }
`;
