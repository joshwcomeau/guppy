// @flow
import React from 'react';
import styled from 'styled-components';

import Panels from './Panels';

type Props = {
  width: number,
  children: React$Node,
};

const HorizontalPanels = ({ width, children, ...delegated }: Props) => (
  <Panels {...delegated} orientation="horizontal" size={width}>
    {React.Children.toArray(children)}
  </Panels>
);

export default HorizontalPanels;
