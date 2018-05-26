// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

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

const springSettings = { stiffness: 150, damping: 22, precision: 5 };

class RoundedOutline extends Component<Props, State> {
  state = {
    width: null,
    height: null,
    pathLength: 0,
    enableTransition: false,
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
      const pathLength = this.shapeNode.getTotalLength();

      this.setState({ pathLength });
    }

    if (prevState.pathLength === 0 && this.state.pathLength !== 0) {
      this.setState({ enableTransition: true });
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
    const { width, height, pathLength, enableTransition } = this.state;

    const svgId = `${color1}-${color2}`;

    return (
      <Motion
        style={{
          dashOffset: enableTransition
            ? spring(isShown ? 0 : pathLength, springSettings)
            : pathLength || 0,
        }}
      >
        {({ dashOffset }) => (
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
                  style={{
                    strokeDasharray: `${pathLength}, ${pathLength + 1}`,
                    strokeDashoffset: dashOffset,
                  }}
                />
              )}
          </Svg>
        )}
      </Motion>
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
