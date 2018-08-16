// @flow
import React from 'react';

type Props = {
  x?: number,
  y?: number,
  reason: string,
  children: React$Node,
};

const PixelShifter = ({ x = 0, y = 0, reason, children }: Props) => (
  <div
    style={{
      transform: `translate(${x}px, ${y}px)`,
    }}
  >
    {children}
  </div>
);

export default PixelShifter;
