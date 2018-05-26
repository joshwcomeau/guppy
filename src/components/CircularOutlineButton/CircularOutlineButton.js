// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

type Props = {
  size: number,
  color1: string,
  color2: string,
  drawOutlineOnHover: boolean,
  children: React$Node,
};

type State = {
  isHovered: boolean,
  pathLength: number,
};

class CircularOutlineButton extends Component<Props, State> {
  state = {
    isHovered: false,
    // HACK: Having trouble with on-mount stroke animation.
    // Setting this to the known value of our 1 instance, but this is obv.
    // a horrible hack.
    pathLength: 101,
  };

  node = HTMLElement;

  static defaultProps = {
    color1: COLORS.gray[800],
    color2: COLORS.gray[500],
  };

  componentDidMount() {
    // $FlowFixMe
    const pathLength = Math.ceil(this.node.getTotalLength()) + 1;

    this.setState({ pathLength });
  }

  render() {
    const {
      size,
      drawOutlineOnHover,
      children,
      color1,
      color2,
      ...delegated
    } = this.props;
    const { isHovered, pathLength } = this.state;

    let ellipseStyles = {};
    if (drawOutlineOnHover) {
      ellipseStyles = {
        strokeDasharray: pathLength,
        strokeDashoffset: isHovered ? 0 : pathLength,
        transition: isHovered
          ? 'stroke-dashoffset 500ms'
          : 'stroke-dashoffset 500ms 500ms',
      };
    }

    // Not using `viewBox` because I want the stroke width to be a constant
    // 2px regardless of SVG size.
    return (
      <ButtonElem
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
        {...delegated}
      >
        <Svg width={size} height={size}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: color1,
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: color2,
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </defs>
          <Ellipse
            innerRef={node => (this.node = node)}
            rx={size / 2}
            ry={size / 2}
            cx={size / 2}
            cy={size / 2}
            fill="none"
            stroke="url(#grad1)"
            strokeWidth={2}
            style={ellipseStyles}
          />
        </Svg>
        {children}
      </ButtonElem>
    );
  }
}

const ButtonElem = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: none;
`;

const Svg = styled.svg`
  overflow: visible;
  position: absolute;
`;

const Ellipse = styled.ellipse`
  transform: rotate(-90deg);
  transform-origin: center center;
  transition: stroke-dashoffset 500ms 500ms;

  ${ButtonElem}:active & {
    stroke-width: 4;
  }
`;

export default CircularOutlineButton;
