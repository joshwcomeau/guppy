// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import CircularOutline from '../CircularOutline';
import { COLORS } from '../../constants';

type Props = {
  src: string,
  size: number,
  color1: string,
  color2: string,
  status: 'default' | 'highlighted' | 'faded',
};

class SelectableImage extends Component<Props> {
  render() {
    const { src, size, color1, color2, status, ...delegated } = this.props;

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
        <ImageFader src={src} isShown={status === 'faded'} />
        <Image src={src} />
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

const Image = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const ImageFader = styled.div`
  background: #fff;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.isShown ? 0.55 : 0)};
  transition: opacity 500ms;
  border-radius: 100%;

  &:hover {
    opacity: 0;
  }
`;

export default SelectableImage;
