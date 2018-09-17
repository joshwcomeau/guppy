import { injectGlobal } from 'styled-components';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-tippy/dist/tippy.css';
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
`;
