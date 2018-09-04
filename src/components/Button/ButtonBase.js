// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Size = 'xsmall' | 'small' | 'medium' | 'large';

type Props = {
  size: Size,
  background?: string,
  hoverBackground?: string,
  textColor?: string,
  noPadding?: boolean,
  activeSplat?: boolean,
  disabled?: boolean,
  children: React$Node,
};

class ButtonBase extends Component<Props> {
  static defaultProps = {
    size: 'medium',
    background: COLORS.gray[200],
    textColor: COLORS.gray[900],
  };

  getButtonElem = (size: Size) => {
    switch (size) {
      case 'xsmall':
        return XSmallButton;
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
      size,
      children,
      background,
      hoverBackground,
      textColor,
      disabled,
      ...delegated
    } = this.props;

    const Elem = this.getButtonElem(size);

    return (
      <Elem
        background={background}
        hoverBackground={hoverBackground}
        textColor={textColor}
        disabled={disabled}
        {...delegated}
      >
        {children}
      </Elem>
    );
  }
}

const ButtonBaseStyles = styled.button`
  position: relative;
  border: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.background};
  color: ${props => props.textColor};
  cursor: pointer;
  outline: none;
  white-space: nowrap;

  &:hover {
    background: ${props => props.hoverBackground};
  }

  &:disabled {
    filter: grayscale(100%);
    opacity: 0.75;
  }

  /*
    HACK: We want to double the border-thickness of StrokeButton when active.
    This feels hacky, but it would also be hacky to manage this state in React.
  */
  &:not(:disabled):active rect {
    stroke-width: 4;
  }

  &:not(:disabled):active {
    transform-origin: center center;
    transform: ${props => props.activeSplat && 'scale(1.1)'};
  }
`;

const XSmallButton = styled(ButtonBaseStyles)`
  padding: ${props => (props.noPadding ? '0px' : '0px 12px')};
  height: ${props => (props.noPadding ? 'auto' : '22px')};
  border-radius: 15px;
  font-size: 12px;
`;

const SmallButton = styled(ButtonBaseStyles)`
  padding: ${props => (props.noPadding ? '0px' : '0px 14px')};
  height: ${props => (props.noPadding ? 'auto' : '30px')};
  border-radius: 17px;
  font-size: 14px;
`;

const MediumButton = styled(ButtonBaseStyles)`
  padding: ${props => (props.noPadding ? '0px' : '0px 20px')};
  height: ${props => (props.noPadding ? 'auto' : '38px')};
  border-radius: 19px;
  font-size: 16px;
`;

const LargeButton = styled(ButtonBaseStyles)`
  padding: ${props => (props.noPadding ? '0px' : '0 32px')};
  height: ${props => (props.noPadding ? 'auto' : '48px')};
  border-radius: 24px;
  font-size: 24px;
`;

export default ButtonBase;
