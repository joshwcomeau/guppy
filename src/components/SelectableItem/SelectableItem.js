// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import CircularOutline from '../CircularOutline';
import DetectActive from '../DetectActive';

export type Status = 'default' | 'highlighted' | 'faded';

export type Props = {
  size: number,
  colors: Array<string>,
  status: Status,
  children: (status: Status) => React$Node,
};

class SelectableItem extends Component<Props> {
  render() {
    const { size, colors, status, children, ...delegated } = this.props;

    return (
      <DetectActive>
        {isActive => (
          <ButtonElem size={size} {...delegated}>
            <OutlineWrapper size={size}>
              <CircularOutline
                colors={colors}
                size={size + 6}
                strokeWidth={isActive ? 4 : 2}
                isShown={status === 'highlighted'}
              />
            </OutlineWrapper>

            {children(status)}
          </ButtonElem>
        )}
      </DetectActive>
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
