// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  index: number,
  orientation: 'horizontal' | 'vertical',
  startResize: (ev: any, index: number) => void,
};

const Resizer = ({ index, orientation, startResize }: Props) => {
  const ResizeComponent =
    orientation === 'horizontal' ? HorizontalResizer : VerticalResizer;
  return <ResizeComponent onMouseDown={ev => startResize(ev, index)} />;
};

const HorizontalResizer = styled.div`
  width: 5px;
  background: rgba(0, 0, 0, 0.4);
  cursor: col-resize;
`;

const VerticalResizer = styled.div`
  height: 5px;
  background: rgba(0, 0, 0, 0.4);
  cursor: row-resize;
`;

export default Resizer;
