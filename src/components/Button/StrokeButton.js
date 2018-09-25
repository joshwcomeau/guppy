// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import ButtonBase from './ButtonBase';

type Props = {
  fillColor: string,
  strokeColors: Array<string>,
  showStroke: boolean,
  children: React$Node,
};

type State = {
  isActive: boolean,
};

class StrokeButton extends Component<Props, State> {
  state = {
    isActive: false,
  };

  static defaultProps = {
    fillColor: COLORS.white,
    strokeColors: [COLORS.purple[500], COLORS.violet[500]],
    showStroke: true,
  };

  handleMouseDown = ev => {
    if (typeof this.props.onMouseDown === 'function') {
      this.props.onMouseDown(ev);
    }

    this.setState({ isActive: true });
  };

  handleMouseUp = ev => {
    if (typeof this.props.onMouseUp === 'function') {
      this.props.onMouseUp(ev);
    }

    this.setState({ isActive: false });
  };

  handleMouseLeave = ev => {
    if (typeof this.props.onMouseLeave === 'function') {
      this.props.onMouseLeave(ev);
    }

    this.setState({ isActive: false });
  };

  render() {
    const {
      fillColor,
      strokeColors,
      showStroke,
      children,
      ...delegated
    } = this.props;
    const { isActive } = this.state;

    return (
      <Wrapper>
        <Foreground>
          <ButtonBase
            background={fillColor}
            {...delegated}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
          >
            <span style={{ display: 'block' }}>{children}</span>
          </ButtonBase>
        </Foreground>

        <Background
          colors={strokeColors}
          isVisible={showStroke}
          isActive={isActive}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  padding: 2px;
`;

const Foreground = styled.span`
  display: block;
  position: relative;
  z-index: 1;
`;

const Background = styled.div`
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
