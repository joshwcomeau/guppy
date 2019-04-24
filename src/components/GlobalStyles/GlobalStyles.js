// @flow
import { createGlobalStyle } from 'styled-components';
import 'react-tippy/dist/tippy.css';
import { COLORS } from '../../constants';
import '../../fonts.css';
import '../../base.css';

const GlobalStyles = createGlobalStyle`
  html,
  body,
  input,
  button,
  select,
  option {
    /* This is important for MacOS Mojave's dark mode */
    color: ${COLORS.text};
  }

  body {
    background: ${COLORS.background};
  }
`;

export default GlobalStyles;
