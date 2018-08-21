// @flow
import React from 'react';

type Props = {
  x?: number,
  y?: number,
  reason: string,
  style?: Object,
  children: React$Node,
};

const PixelShifter = ({
  x = 0,
  y = 0,
  reason,
  style = {},
  children,
}: Props) => (
  <div
    style={{
      transform: `translate(${x}px, ${y}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

export default PixelShifter;
