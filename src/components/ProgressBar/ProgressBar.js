// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Spring, animated } from 'react-spring';

import { GRADIENTS } from '../../constants';

// TODO: consider renaming stiffness and damping to tension and friction
type Props = {
  height: number,
  progress: number,
  stiffness: number,
  damping: number,
  colors: Array<string>,
  reset: boolean,
};

class ProgressBar extends Component<Props> {
  static defaultProps = {
    height: 8,
    stiffness: 32,
    damping: 32,
    colors: GRADIENTS.progress,
    reset: false,
  };

  render() {
    const { height, progress, stiffness, damping, colors, reset } = this.props;

    return (
      <Wrapper height={height}>
        <Spring
          from={{ progress: 0 }}
          to={{ progress }}
          config={{ tension: stiffness, friction: damping }}
          native
          reset={reset}
        >
          {interpolated => (
            <ProgressGradient
              colors={colors}
              progress={interpolated.progress}
            />
          )}
        </Spring>
      </Wrapper>
    );
  }
}

export const Wrapper = styled.div`
  position: relative;
  height: ${props => props.height}px;
  width: 100%;
`;

const ProgressGradient = styled(animated.div).attrs(({ progress }) => ({
  style: {
    clipPath: progress.interpolate(
      p => `polygon(
      0% 0%,
      ${p * 100}% 0%,
      ${p * 100}% 100%,
      0% 100%
    `
    ),
  },
}))`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, ${props => props.colors.join(', ')});
`;

export default ProgressBar;
