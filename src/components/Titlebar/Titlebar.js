// @flow
/**
 * The title bar in this app is invisible, and yet it still needs to be defined,
 * as it constitutes the "draggable" area of the window.
 */
import styled from 'styled-components';

import { Z_INDICES } from '../../constants';

export default styled.div`
  position: fixed;
  z-index: ${Z_INDICES.titlebar};
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;
