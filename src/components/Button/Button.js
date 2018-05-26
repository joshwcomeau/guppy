// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import CircularOutline from '../CircularOutline';

type Props = {
  type: 'fill' | 'stroke',
  size: 'small' | 'medium' | 'large',
  color1: string,
  color2: string,
  showOutline: boolean,
  noPadding: boolean,
  children: React$Node,
};

type State = {
  isHovered: boolean,
};

class Button extends Component<Props, State> {
  static defaultProps = {
    type: 'stroke',
    size: 'medium',
    color1: COLORS.purple[500],
    color2: COLORS.violet[500],
    showOutline: true,
    style: {},
  };

  getButtonElem = size => {
    switch (size) {
      case 'small':
        return SmallButton;
      case 'medium':
        return MediumButton;
      case 'large':
        return LargeButton;
    }
  };

  render() {
    const {
      type,
      size,
      children,
      color1,
      color2,
      showOutline,
      style,
      ...delegated
    } = this.props;

    const Elem = this.getButtonElem(size);

    let mutatedStyle = { ...style };
    if (type === 'fill') {
      mutatedStyle.color = '#FFF';
      mutatedStyle.backgroundImage = `
        linear-gradient(
          70deg,
          ${color1},
          ${color2}
        )
      `;
    }

    return (
      <Elem style={mutatedStyle} {...delegated}>
        {type === 'stroke' && (
          <CircularOutline
            color1={color1}
            color2={color2}
            isShown={showOutline}
          />
        )}

        {children}
      </Elem>
    );
  }
}

const ButtonBase = styled.button`
  position: relative;
  border: 0;
  background: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;

  &:active rect {
    stroke-width: 4;
  }
`;

const SmallButton = styled(ButtonBase)`
  padding: ${props => (props.noPadding ? '0px' : '0px 14px')};
  height: ${props => (props.noPadding ? 'auto' : '34px')};
  border-radius: 17px;
  font-size: 14px;
`;

const MediumButton = styled(ButtonBase)`
  padding: ${props => (props.noPadding ? '0px' : '0px 20px')};
  height: ${props => (props.noPadding ? 'auto' : '38px')};
  border-radius: 19px;
  font-size: 16px;
`;

const LargeButton = styled(ButtonBase)`
  padding: ${props => (props.noPadding ? '0px' : '0 32px')};
  height: ${props => (props.noPadding ? 'auto' : '48px')};
  border-radius: 24px;
  font-size: 24px;
`;

export default Button;
