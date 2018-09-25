// @flow
/**
 * Draws a totally-rounded circle inside the parent node.
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Spring } from 'react-spring';

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

    const dashOffset = isShown ? circumference : 0;

    return (
      <Spring config={springSettings} to={{ dashOffset }}>
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

            <ellipse
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
  transform: rotate(-90deg);
`;

export default CircularOutline;
