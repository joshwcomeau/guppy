// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Resizer = ({ index, startResize }) => (
  <HorizontalResizer onMouseDown={ev => startResize(ev, index)} />
);

const HorizontalResizer = styled.div`
  width: 5px;
  background: rgba(0, 0, 0, 0.2);
  cursor: col-resize;
`;

export default Resizer;
