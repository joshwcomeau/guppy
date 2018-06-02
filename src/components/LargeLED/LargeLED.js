// @flow
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Color from 'color';
import { Spring } from 'react-spring';

import { COLORS } from '../../constants';

import type { TaskStatus } from '../../types';

type Props = {
  size: number,
  status: TaskStatus,
};

const getColorsForStatus = (status: TaskStatus) => {
  switch (status) {
    case 'idle': {
      return {
        base: COLORS.gray[700],
        highlight: COLORS.gray[500],
        pulseBase: COLORS.gray[700],
        pulseHighlight: COLORS.gray[500],
        shadowLight: Color(COLORS.gray[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(COLORS.gray[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }
    case 'running': {
      return {
        base: COLORS.green[500],
        highlight: COLORS.lime[500],
        pulseBase: COLORS.green[700],
        pulseHighlight: COLORS.lime[500],
        shadowLight: Color(COLORS.green[900])
          .alpha(0.25)
          .rgb()
          .string(),
        shadowDark: Color(COLORS.green[900])
          .alpha(0.5)
          .rgb()
          .string(),
      };
    }
  }
};

class LargeLED extends Component<Props> {
  static defaultProps = {
    size: 64,
  };

  state = {
    // TODO: Can I just init this as blank?
    prevColors: getColorsForStatus('idle'),
    colors: getColorsForStatus(this.props.status),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== nextProps.status) {
      this.setState({
        prevColors: this.state.colors,
        colors: getColorsForStatus(nextProps.status),
      });
    }
  }

  render() {
    const { size, status } = this.props;

    const OUTLINE_SIZE = size * (5.5 / 8);

    const colors = getColorsForStatus(status);

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
            {status !== 'idle' && <Pulser colors={colors} />}
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
  animation: ${fadeInOut} 2500ms infinite;
  border-radius: 50%;
`;

export default LargeLED;
