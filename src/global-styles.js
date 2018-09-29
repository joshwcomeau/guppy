import { createGlobalStyle } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import { COLORS } from './constants';
import './fonts.css';
import './base.css';

const GlobalStyle = createGlobalStyle`
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

export default GlobalStyle;
