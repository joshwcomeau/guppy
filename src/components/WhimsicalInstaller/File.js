// @flow
import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  x: number,
  y: number,
  size?: number,
  id: string,
  handleMouseDown?: (id: string) => void,
};

// Possible optimization: Separate x/y stuff from the SVG renderer, since it
// seems like it takes a while to diff this tree?

const File = ({ x, y, size = 50, id, handleMouseDown }: Props) => (
  <Wrapper
    x={x}
    y={y}
    size={size}
    viewBox="0 0 20 28"
    onMouseDown={() =>
      typeof handleMouseDown === 'function' && handleMouseDown(id)
    }
  >
    <defs>
      <filter id="file-corner" x="-100%" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceGraphic" dx="-1" dy="1" />
        <feColorMatrix
          result="matrixOut"
          in="offOut"
          type="matrix"
          values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
        />
        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="1" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
    <path
      d={`
        M0,0
        L15,0
        L20,5
        L20,28
        L0,28
      `}
      stroke="none"
      fill={COLORS.white}
    />
    <FoldedCorner
      points="15,0 15,5 20,5"
      stroke="none"
      fill={COLORS.white}
      filter="url(#file-corner)"
    />
  </Wrapper>
);

const Wrapper = styled.svg.attrs({
  style: props => ({
    top: props.y + 'px',
    left: props.x + 'px',
  }),
})`
  position: absolute;
  z-index: 2;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  height: ${props => props.size}px;
  overflow: visible;
  transform: translate(-50%, -50%);
`;

const FoldedCorner = styled.polygon`
  box-shadow: -3px -3px 4px -2px rgba(0, 0, 0, 0.2);
`;

export default File;
