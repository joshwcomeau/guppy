// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';

import { COLORS } from '../../constants';

type Props = {
  size: number,
  isVisible: boolean,
  onClick: () => void,
  isOnline: boolean,
};

const AddProjectButton = ({ size, isVisible, onClick, isOnline }: Props) => (
  <Button
    isOnline={isOnline}
    size={size}
    isVisible={isVisible}
    onClick={onClick}
  >
    <IconWrapper>
      <IconBase
        size={30}
        icon={plus}
        style={{ color: COLORS.textOnBackground }}
      />
    </IconWrapper>
    <Background />
  </Button>
);

const Button = styled.button`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  opacity: ${props => (props.isOnline ? 1 : 0.5)};
  pointer-events: ${props => (props.isOnline ? 'auto' : 'none')};
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${COLORS.lightBackground};
  opacity: 0.1;
  transition: opacity 300ms;
  border-radius: 100%;

  ${Button}:hover & {
    opacity: 0.2;
  }

  ${Button}:focus & {
    opacity: 0.3;
  }
`;

const IconWrapper = styled.div`
  transform: translate(1px, 2px);
`;

export default AddProjectButton;
