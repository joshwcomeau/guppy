// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import CircularOutline from '../CircularOutline';

type Status = 'default' | 'highlighted' | 'faded';

type Props = {
  size: number,
  color1: string,
  color2: string,
  status: Status,
  children: (status: Status) => React$Node,
};

class SelectableItem extends Component<Props> {
  render() {
    const { size, color1, color2, status, children, ...delegated } = this.props;

    return (
      <ButtonElem size={size} {...delegated}>
        <OutlineWrapper size={size}>
          <CircularOutline
            color1={color1}
            color2={color2}
            size={size + 6}
            isShown={status === 'highlighted'}
          />
        </OutlineWrapper>

        {children(status)}
      </ButtonElem>
    );
  }
}

const ButtonElem = styled.button`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: none;
  background: none;
  outline: none;
  padding: 0;
  cursor: pointer;

  &:active rect {
    stroke-width: 4;
  }
`;

const OutlineWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  pointer-events: none;
`;

export default SelectableItem;
