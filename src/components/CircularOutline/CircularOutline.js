// @flow
/**
 * Draws a totally-rounded circle inside the parent node.
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Spring, animated } from 'react-spring';

import { COLORS } from '../../constants';

type Props = {
  size: number,
  color1: string,
  color2: string,
  strokeWidth: number,
  isShown: boolean,
};

const springSettings = {
  tension: 150,
  friction: 22,
  // We want to tweak the 'onRest' timing so that the animation ends a bit
  // earlier. Otherwise, we wind up with a surprisingly long wait while the
  // very end of the stroke disappears, when hiding the stroke.
  restSpeedThreshold: 3,
  restDisplacementThreshold: 10,
};

class CircularOutline extends Component<Props> {
  static defaultProps = {
    color1: COLORS.purple[500],
    color2: COLORS.violet[500],
    strokeWidth: 2,
  };

  render() {
    const { size, color1, color2, strokeWidth, isShown } = this.props;

    const svgId = `${color1.replace('#', '')}-${color2.replace('#', '')}`;

    // Yay middle-school maths
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;

    const dashOffset = isShown ? 0 : circumference;

    return (
      <Spring native config={springSettings} to={{ dashOffset }}>
        {interpolated => (
          <Svg width={size} height={size}>
            <defs>
              <linearGradient id={svgId} x1="0%" y1="100%" x2="100%" y2="0%">
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

            <animated.ellipse
              cx={radius}
              cy={radius}
              rx={radius}
              ry={radius}
              fill="none"
              stroke={`url(#${svgId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                strokeDasharray: `
                  ${circumference},
                  ${circumference + 1}
                `,
                strokeDashoffset: interpolated.dashOffset,
              }}
            />
          </Svg>
        )}
      </Spring>
    );
  }
}

const Svg = styled.svg`
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
  /* Have the animation start from the top, not the right */
  transform: rotate(-90deg);
`;

export default CircularOutline;
