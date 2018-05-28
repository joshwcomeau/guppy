// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { plus } from 'react-icons-kit/feather/plus';

import HoverableOutlineButton from '../HoverableOutlineButton';
import { COLORS } from '../../constants';

type Props = {
  size: number,
  isVisible: boolean,
  onClick: () => void,
};

const AddProjectButton = ({ size, isVisible, onClick }: Props) => (
  <Button
    noPadding
    size={size}
    isVisible={isVisible}
    color1={COLORS.white}
    color2={COLORS.white}
    onClick={onClick}
  >
    <IconWrapper>
      <IconBase size={30} icon={plus} style={{ color: COLORS.white }} />
    </IconWrapper>
    <Background />
  </Button>
);

const Button = styled(HoverableOutlineButton).attrs({
  style: props => ({
    width: props.size + 6 + 'px',
    height: props.size + 6 + 'px',
    opacity: props.isVisible ? 1 : 0,
  }),
})`
  transition: opacity 750ms;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
`;

const IconWrapper = styled.div`
  transform: translate(1px, 2px);
`;

export default AddProjectButton;
