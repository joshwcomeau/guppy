import React from 'react';
import styled from 'styled-components';

import { StrokeButton } from '../Button';

const ButtonWithIcon = ({ icon, children, ...delegated }) => (
  // TODO: Support other sizes
  <StrokeButton noPadding {...delegated}>
    <InnerWrapper>
      <IconWrapper>{icon}</IconWrapper>
      {children}
    </InnerWrapper>
  </StrokeButton>
);

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 10px 0 32px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ButtonWithIcon;
