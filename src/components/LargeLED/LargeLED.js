// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import { Spring } from 'react-spring';

import { getColorsForStatus } from './LargeLED.helpers';

import type { TaskStatus } from '../../types';
import type { ColorData } from './LargeLED.helpers';

// TODO: The statuses in this component are based on the TaskStatus.
// This works for DevServer, but is not generalizable for other tasks that are
// not long-running.
// Instead, the statuses should be:
// - success (green)
// - pending (yellow)
// - error (red)
// - idle (gray)

type Props = {
  size: number,
  status: TaskStatus,
};

type State = {
  colors: ColorData,
  prevColors: ColorData,
};

class LargeLED extends Component<Props, State> {
  static defaultProps = {
    size: 64,
  };

  state = {
    colors: getColorsForStatus(this.props.status),
    // TODO: Can I just init this as blank?
    prevColors: getColorsForStatus('idle'),
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.status !== nextProps.status) {
      this.setState({
        prevColors: this.state.colors,
        colors: getColorsForStatus(nextProps.status),
      });
    }
  }

  render() {
    const { size, status } = this.props;

    const pulseSpeed = status === 'failed' ? 750 : 2500;

    const OUTLINE_SIZE = size * (5.5 / 8);

    return (
      <Spring from={this.state.prevColors} to={this.state.colors}>
        {colors => (
          <LED size={size} colors={colors}>
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
            {status !== 'idle' && <Pulser colors={colors} speed={pulseSpeed} />}
          </LED>
        )}
      </Spring>
    );
  }
}

const fadeInOut = keyframes`
  0% { opacity: 0.25 }
  50% { opacity: 0.7 }
  100% { opacity: 0.25 }
`;

const LED = styled.div.attrs({
  style: props => ({
    backgroundImage: `
      radial-gradient(
        farthest-corner at 10px 5px,
        ${props.colors.highlight} 0%,
        ${props.colors.base} 100%
      )
    `,
    boxShadow: `
      inset 1px 1px 5px ${props.colors.shadowLight},
      inset -3px -3px 10px -2px ${props.colors.shadowDark}
    `,
  }),
})`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  border: 2px solid #fff; /* TODO: kill? */
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

const Pulser = styled.div.attrs({
  style: props => ({
    backgroundImage: `
      radial-gradient(
        farthest-corner at 10px 5px,
        ${props.colors.pulseHighlight} 0%,
        ${props.colors.pulseBase} 100%
      )
    `,
  }),
})`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: ${fadeInOut} ${props => props.speed}ms infinite;
  border-radius: 50%;
`;

export default LargeLED;
