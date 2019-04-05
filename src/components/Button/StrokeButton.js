// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS, GRADIENTS } from '../../constants';

import DetectActive from '../DetectActive';
import ButtonBase from './ButtonBase';

export type Props = {
  fillColor?: string,
  strokeColors?: Array<string>,
  showStroke?: boolean,
  children: React$Node,
};

class StrokeButton extends Component<Props> {
  static defaultProps = {
    fillColor: COLORS.lightBackground,
    strokeColors: GRADIENTS.primary,
    showStroke: true,
  };

  render() {
    const {
      fillColor,
      strokeColors,
      showStroke,
      children,
      ...delegated
    } = this.props;

    return (
      <DetectActive>
        {isActive => (
          <Wrapper>
            <Foreground>
              <ButtonBase background={fillColor} {...delegated}>
                <span style={{ display: 'block' }}>{children}</span>
              </ButtonBase>
            </Foreground>

            <Background
              colors={strokeColors}
              isVisible={showStroke}
              isActive={isActive}
            />
          </Wrapper>
        )}
      </DetectActive>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  padding: 2px;
`;

export const Foreground = styled.span`
  display: block;
  position: relative;
  z-index: 1;
`;

export const Background = styled.div`
  position: absolute;
  z-index: 0;
  top: ${props => (props.isActive ? -2 : 0)}px;
  left: ${props => (props.isActive ? -2 : 0)}px;
  right: ${props => (props.isActive ? -2 : 0)}px;
  bottom: ${props => (props.isActive ? -2 : 0)}px;
  border-radius: 100px;
  background: linear-gradient(25deg, ${props => props.colors.join(', ')});
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transition: opacity 350ms;
`;

export default StrokeButton;
