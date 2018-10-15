// @flow
import styled from 'styled-components';

import { BREAKPOINTS } from '../../constants';

import { SIDEBAR_WIDTH } from '../Sidebar';

export default styled.div`
  width: 1050px;
  max-width: calc(100vw - ${SIDEBAR_WIDTH}px);

  @media ${BREAKPOINTS.sm} {
    padding: 40px;
  }

  @media ${BREAKPOINTS.mdMin} {
    padding: 75px;
  }
`;
