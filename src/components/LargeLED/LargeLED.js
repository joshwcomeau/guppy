// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Color from 'color';

import { COLORS } from '../../constants';

import type { TaskStatus } from '../../types';

type Props = {
  size: number,
  status: TaskStatus,
};

class LargeLED extends Component<Props> {
  static defaultProps = {
    size: 64,
  };

  render() {
    const { size } = this.props;

    const OUTLINE_SIZE = size * (5.5 / 8);

    return (
      <LED size={size}>
        <OutlineSvg
          width={OUTLINE_SIZE}
          height={OUTLINE_SIZE}
          viewBox="0 0 28 28"
        >
          <ellipse
            cx={14}
            cy={14}
            rx={14}
            ry={14}
            fill="none"
            stroke="#FFF"
            strokeWidth={3}
            strokeDasharray="6 100"
            strokeDashoffset={-50}
            strokeLinecap="round"
          />
        </OutlineSvg>
        <Pulser color={COLORS.lightGreen[500]} />
      </LED>
    );
  }
}

const fadeInOut = keyframes`
  0% { opacity: 0.25 }
  50% { opacity: 0.7 }
  100% { opacity: 0.25 }
`;

const LED = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-image: radial-gradient(
    farthest-corner at 10px 5px,
    ${COLORS.lime[500]} 0%,
    ${COLORS.green[500]} 100%
  );
  border: 2px solid #fff;
  box-shadow: inset 1px 1px 5px
      ${Color(COLORS.green[900])
        .alpha(0.25)
        .rgb()
        .string()},
    inset -3px -3px 10px -2px ${Color(COLORS.green[900])
        .alpha(0.5)
        .rgb()
        .string()};
`;

const OutlineSvg = styled.svg`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: visible;
`;

const Pulser = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    farthest-corner at 10px 5px,
    ${COLORS.lime[500]} 0%,
    ${COLORS.green[700]} 100%
  );
  animation: ${fadeInOut} 2500ms infinite;
  border-radius: 50%;
`;

export default LargeLED;
