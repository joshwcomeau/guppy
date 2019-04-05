// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../../src/constants';

type Props = {
  children: any,
};

class Wrapper extends Component<Props> {
  render() {
    const { children } = this.props;
    return (
      <OuterWrapper>
        <InnerWrapper>{children}</InnerWrapper>
      </OuterWrapper>
    );
  }
}

const OuterWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const InnerWrapper = styled.div`
  background: ${COLORS.lightBackground};
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  margin: 2rem;
  padding: 1.5rem;
  max-width: 1100px;
  border-radius: 4px;
`;

export default Wrapper;
