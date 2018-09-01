// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  index: number,
  startResize: (ev: any, index: number) => void,
};

const Resizer = ({ index, startResize }: Props) => (
  <HorizontalResizer onMouseDown={ev => startResize(ev, index)} />
);

const HorizontalResizer = styled.div`
  width: 5px;
  background: rgba(0, 0, 0, 0.4);
  cursor: col-resize;
`;

export default Resizer;
