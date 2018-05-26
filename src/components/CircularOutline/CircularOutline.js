// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { COLORS } from '../../constants';

type Props = {
  size: number,
  color1: string,
  color2: string,
  strokeWidth: number,
  isShown: boolean,
};

type State = {
  width: ?number,
  height: ?number,
  pathLength: number,
};

class RoundedOutline extends Component<Props, State> {
  state = {
    width: null,
    height: null,
    pathLength: null,
  };

  static defaultProps = {
    color1: COLORS.gray[800],
    color2: COLORS.gray[500],
    strokeWidth: 2,
  };

  componentDidMount() {
    // On first mount, we need to figure out how big the available area is.
    // This will affect how large the outline is.
    const { width, height } = this.wrapperNode.getBoundingClientRect();

    this.setState({ width, height });
  }

  componentDidUpdate(_, prevState) {
    if (
      prevState.width == null &&
      prevState.height == null &&
      this.state.width !== null &&
      this.state.height !== null
    ) {
      // $FlowFixMe
      const pathLength = Math.ceil(this.shapeNode.getTotalLength()) + 1;

      this.setState({ pathLength });
    }
  }

  render() {
    const {
      size,
      color1,
      color2,
      strokeWidth,
      showDelay,
      hideDelay,
      isShown,
    } = this.props;
    const { width, height, pathLength } = this.state;

    const shapeStyles = {
      strokeDasharray: pathLength,
      strokeDashoffset: isShown ? 0 : pathLength,
      transition: isShown
        ? `stroke-dashoffset 500ms`
        : `stroke-dashoffset 250ms`,
    };

    console.log(height);

    const svgId = `${color1}-${color2}`;

    return (
      <Svg
        innerRef={node => (this.wrapperNode = node)}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id={svgId} x1="0%" y1="0%" x2="100%" y2="0%">
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
        {typeof width === 'number' &&
          typeof height === 'number' && (
            <Rect
              innerRef={node => (this.shapeNode = node)}
              x={0}
              y={0}
              width={width}
              height={height}
              rx={height / 2}
              ry={width / 2}
              fill="none"
              stroke={`url(#${svgId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={shapeStyles}
            />
          )}
      </Svg>
    );
  }
}

const Svg = styled.svg`
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
`;

const Rect = styled.rect``;

export default RoundedOutline;
