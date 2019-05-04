// @flow
import React, { Component } from 'react';
import { Spring, animated } from 'react-spring';
import styled from 'styled-components';
import Color from 'color';

import { COLORS, GRADIENTS } from '../../constants';

type Props = {
  width: number,
  height: number,
  thickness: number,
  colors: Array<string>,
  children?: React$Node,
  isOn: boolean,
  onClick: (ev: SyntheticMouseEvent<*>) => void,
};

type State = {
  isActive: boolean,
};

class BigClickableButton extends Component<Props, State> {
  static defaultProps = {
    width: 64,
    height: 64,
    thickness: 6,
    colors: GRADIENTS.darkPrimary,
  };

  state = {
    status: 'off',
    isActive: false,
  };

  depress = () => this.setState({ isActive: true });
  release = () => this.setState({ isActive: false });

  render() {
    const {
      width,
      height,
      thickness,
      colors,
      onClick,
      isOn,
      children,
    } = this.props;
    const { isActive } = this.state;

    const bottomColor = Color(colors[0])
      .darken(0.3)
      .rgb()
      .string();
    const sideColor = Color(colors[1])
      .darken(0.3)
      .rgb()
      .string();

    const background = `linear-gradient(45deg, ${colors.join(', ')})`;

    // When the user is actively clicking on it, it should be all-the-way
    // depressed (full thickness).
    // Otherwise, the amount of depression will depend on whether or not the
    // button is "on".
    // transition order is always 0 => thickness =>  thickness - 2
    const amountDepressedOptions = [0, thickness, thickness - 2];

    const depressedToIndex = isActive ? 1 : isOn ? 2 : 0;
    const depressedFromIndex =
      depressedToIndex === 0 ? 2 : depressedToIndex - 1;

    return (
      <OuterWrapper thickness={thickness}>
        <Spring
          from={{ offset: amountDepressedOptions[depressedFromIndex] }}
          to={{ offset: amountDepressedOptions[depressedToIndex] }}
          config={{
            tension: 196,
            friction: 16,
          }}
          native
        >
          {interpolated => (
            <Wrapper width={width} height={height} offset={interpolated.offset}>
              <Button
                width={width}
                height={height}
                background={background}
                onMouseDown={this.depress}
                onMouseUp={this.release}
                onMouseLeave={this.release}
                onClick={onClick}
              >
                {children}
              </Button>
              <ButtonSideWrapper>
                <SidesSvg
                  style={{ display: 'block' }}
                  width={width + thickness + 2}
                  height={height + thickness + 2}
                >
                  <path
                    d={`
                      M 0,${height}
                      L ${width},${height}
                      L ${width + thickness + 2},${height + thickness + 2}
                      L ${thickness},${height + thickness + 2}
                    `}
                    fill={bottomColor}
                  />
                  <path
                    d={`
                      M ${width},0
                      L ${width + thickness + 2},${thickness}
                      L ${width + thickness + 2},${height + thickness + 2}
                      L ${width}, ${height}
                    `}
                    fill={sideColor}
                  />
                </SidesSvg>
              </ButtonSideWrapper>
            </Wrapper>
          )}
        </Spring>
      </OuterWrapper>
    );
  }
}

const OuterWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding-right: ${props => props.thickness}px;
  padding-bottom: ${props => props.thickness}px;
`;

export const Wrapper = animated(styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: ${props => `translate(${props.offset}px, ${props.offset}px)`};
`);

export const Button = styled.button`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: ${COLORS.textOnBackground};
  font-size: 18px;

  border: none;
  background: ${props => props.background};
  outline: none; /* TODO: Better a11y story :/ */
`;

export const ButtonSideWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const SidesSvg = styled.svg``;

export default BigClickableButton;
