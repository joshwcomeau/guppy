// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { COLORS } from '../../constants';

type Props = {
  height: number,
  progress: number,
  stiffness: number,
  damping: number,
  colors: Array<string>,
};

class ProgressBar extends Component<Props> {
  static defaultProps = {
    height: 8,
    stiffness: 32,
    damping: 32,
    colors: [COLORS.blue[700], COLORS.teal[500], COLORS.lightGreen[500]],
  };

  render() {
    const { height, progress, stiffness, damping, colors } = this.props;

    return (
      <Wrapper height={height}>
        <Motion
          style={{
            interpolatedProgress: spring(progress, {
              stiffness,
              damping,
              precision: 0.0001,
            }),
          }}
        >
          {({ interpolatedProgress }) => (
            <ProgressGradient colors={colors} progress={interpolatedProgress} />
          )}
        </Motion>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  height: ${props => props.height}px;
  width: 100%;
`;

const ProgressGradient = styled.div.attrs({
  style: props => ({
    clipPath: `polygon(
      0% 0%,
      ${props.progress * 100}% 0%,
      ${props.progress * 100}% 100%,
      0% 100%
    `,
  }),
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, ${props => props.colors.join(', ')});
`;

export default ProgressBar;
