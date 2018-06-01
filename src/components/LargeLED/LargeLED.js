// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';

import type { TaskStatus } from '../../types';

type Props = {
  status: TaskStatus,
};

class LargeLED extends Component<Props> {
  render() {
    const OUTLINE_SIZE = 14;
    return (
      <LED>
        <OutlineSvg width={OUTLINE_SIZE} height={OUTLINE_SIZE}>
          <ellipse
            cx={OUTLINE_SIZE / 2}
            cy={OUTLINE_SIZE / 2}
            rx={OUTLINE_SIZE / 2}
            ry={OUTLINE_SIZE / 2}
            fill="none"
            stroke="#FFF"
            strokeWidth={2}
            strokeDasharray="4 100"
            strokeDashoffset={-25}
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  /* background-color: ${COLORS.green[500]}; */
  background-image: radial-gradient(farthest-corner at 10px 5px,
      ${COLORS.lime[500]} 0%, ${COLORS.green[700]} 100%);
  /* box-shadow: 0px 2px 12px -2px ${COLORS.green[500]}; */
  border: 2px solid #fff;
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
  background-color: ${props => props.color};
  animation: ${fadeInOut} 5000ms infinite;
  border-radius: 50%;
`;

export default LargeLED;
