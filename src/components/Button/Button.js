// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import CircularOutline from '../CircularOutline';

type Size = 'small' | 'medium' | 'large';
type Type = 'fill' | 'stroke';

type Props = {
  type: Type,
  size: Size,
  color1: string,
  color2: string,
  textColor?: string,
  showOutline: boolean,
  noPadding?: boolean,
  style: { [key: string]: any },
  disabled?: boolean,
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

  getButtonElem = (size: Size) => {
    switch (size) {
      case 'small':
        return SmallButton;
      default:
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
      textColor,
      showOutline,
      style,
      disabled,
      ...delegated
    } = this.props;

    const Elem = this.getButtonElem(size);

    let mutatedStyle = { ...style };
    if (type === 'fill') {
      mutatedStyle.color = '#FFF';
      mutatedStyle.backgroundImage = `
        linear-gradient(
          45deg,
          ${color1},
          ${color2}
        )
      `;
    }

    if (textColor) {
      mutatedStyle.color = textColor;
    }

    return (
      <Elem disabled={disabled} type={type} style={mutatedStyle} {...delegated}>
        <CircularOutline
          color1={disabled ? COLORS.gray[400] : color1}
          color2={disabled ? COLORS.gray[300] : color2}
          isShown={showOutline}
          animateChanges={type === 'stroke'}
        />

        <span style={{ display: 'block' }}>{children}</span>
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
  color: ${COLORS.gray[900]};
  white-space: nowrap;

  &:not(:disabled):active rect {
    stroke-width: 4;
  }

  &:disabled {
    background-image: ${props =>
      props.type === 'fill' &&
      `linear-gradient(
      45deg,
      ${COLORS.gray[400]},
      ${COLORS.gray[300]}
    ) !important`};
  }
`;

const SmallButton = styled(ButtonBase)`
  padding: ${props => (props.noPadding ? '0px' : '0px 14px')};
  height: ${props => (props.noPadding ? 'auto' : '30px')};
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
