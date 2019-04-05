// @flow
/**
 * Draws a totally-rounded circle inside the parent node.
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Spring, animated } from 'react-spring';

import { GRADIENTS } from '../../constants';

type Props = {
  size: number,
  colors: Array<string>,
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
    colors: GRADIENTS.primary,
    strokeWidth: 2,
  };

  renderGradientStop = (
    color: string,
    index: number,
    colors: Array<string>
  ) => {
    // Each stop needs a unique key, and we'll create one from the available
    // data
    const key = `${index}-${color}`;

    // For the offsets, we want to ensure even spacing from 0 to 100.
    // With 2 colors, we want [0, 100]
    // With 3 colors, we want [0, 50, 100]
    //
    // In a 3-color example, we need to divide the current index (0, 1, 2)
    // by 2, and then multiply by 100, to get the values we want:
    //
    // 0 / 2 = 0        * 100 = 0
    // 1 / 2 = 0.5      * 100 = 50              Perfect :D
    // 2 / 2 = 1        * 100 = 100
    //
    // Where did the denominator `2` come from? It's 1 less than the number of
    // colors we're iterating through.
    const denominator = colors.length - 1;

    // The reason for it being 1 less is because we want to be inclusive of
    // both the lower AND upper bounds. Without it, our numbers don't climb
    // high enough:
    //
    // 0 / 3 = 0        * 100 = 0
    // 1 / 3 = 0.333    * 100 = 33.3              Not good :/
    // 2 / 3 = 0.666    * 100 = 66.6
    //
    // Having the denominator be 1 less means that our first value is at 0,
    // our last value is at 100, and the midpoint values are spread evenly
    // between them.

    const offset = (index / denominator) * 100;
    const offsetPercentage = `${offset}%`;

    return (
      <stop
        key={key}
        offset={offsetPercentage}
        style={{
          stopColor: color,
          stopOpacity: 1,
        }}
      />
    );
  };

  render() {
    const { size, colors, strokeWidth, isShown } = this.props;

    const svgId = `${colors.map(color => color.replace('#', '')).join('-')}`;

    // Yay middle-school maths
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;

    const dashOffset = isShown ? 0 : circumference;

    // CircularOutline features a gradient, which means we need at least 2
    // colors for this to work.
    // If the user only supplied 1 color, we can fake it by having a gradient
    // with the same value in both positions.
    let gradientColors = colors;
    if (gradientColors.length === 1) {
      gradientColors = [colors[0], colors[0]];
    }

    return (
      <Spring native config={springSettings} to={{ dashOffset }}>
        {interpolated => (
          <Svg width={size} height={size}>
            <defs>
              <linearGradient id={svgId} x1="0%" y1="100%" x2="100%" y2="0%">
                {gradientColors.map(this.renderGradientStop)}
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
