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
  colors?: string[],
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
    colors: [COLORS.purple[500], COLORS.violet[500]],
    strokeWidth: 2,
  };

  render() {
    const { size, colors, strokeWidth, isShown } = this.props;

    const svgId = `${colors.map(color => color.replace('#', '')).join('-')}`;

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
                    stopColor: colors[0] || COLORS.purple[500],
                    stopOpacity: 1,
                  }}
                />
                {colors.slice(1, colors.length - 1).map((color, i, colorsInTheMiddle) => (
                  <stop
                    offset={`${(i * 100 / (colorsInTheMiddle.length + 1)).toFixed(2)}%`}
                    style={{
                      stopColor: color,
                      stopOpacity: 1,
                    }}
                  />
                ))}
                <stop
                  offset="100%"
                  style={{
                    stopColor: colors[colors.length - 1] || COLORS.purple[500],
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
