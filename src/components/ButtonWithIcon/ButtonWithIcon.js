import React, { Component } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';

import Button from '../Button';

const ButtonWithIcon = ({ size, icon, children, ...delegated }) => (
  <Button noPadding size={size} {...delegated}>
    <InnerWrapper>
      <IconWrapper>
        <IconBase icon={icon} style={{ fontSize: 'inherit' }} />
      </IconWrapper>
      {children}
    </InnerWrapper>
  </Button>
);

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 4px 10px 4px 32px;
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
