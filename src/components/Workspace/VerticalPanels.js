// @flow
import React from 'react';

import Panels from './Panels';

type Props = {
  height: number,
  children: React$Node,
};

const HorizontalPanels = ({ height, children, ...delegated }: Props) => (
  <Panels {...delegated} orientation="vertical" size={height}>
    {children}
  </Panels>
);

export default HorizontalPanels;
