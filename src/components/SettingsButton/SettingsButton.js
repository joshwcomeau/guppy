import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import chroma from 'chroma-js';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather/settings';
import { COLORS } from '../../constants';
import type { Project } from '../../types';

type Props = {
  size: number,
  color: ?string,
  hoverColor: ?string,
};

type State = {
  rotations: number,
  scale: number,
  color: number,
  hovered: boolean,
};

class SettingsButton extends Component<Props, State> {
  static defaultProps = {
    size: 30,
    color: COLORS.gray[600],
    hoverColor: COLORS.purple[700], // purple or violet 500/700
  };

  state = {
    rotations: 0,
    scale: 1.0,
    color: 0,
    hovered: false,
  };

  handleMouseEnter = () => {
    // We can try a bunch of numbers here.
    // 0.5? 1? 2? 5?
    const numOfRotationsOnHover = 0.3;
    this.setState(state => ({
      hovered: true,
      rotations: state.rotations + numOfRotationsOnHover,
      color: 1,
      scale: 1.3,
    }));
  };

  handleMouseLeave = () => {
    // I wonder if we should "unwind" it on mouseout?
    // I'm not sure... maybe try it with/without this?
    this.setState({ hovered: false, rotations: 0, color: 0, scale: 1.0 });
  };

  render() {
    return (
      // Omitting most of the structure that isn't relevant
      <Motion
        style={{
          rotations: spring(this.state.rotations),
          color: spring(this.state.color),
          scale: spring(this.state.scale),
        }}
      >
        {({ rotations, scale, color }) => (
          <Wrapper>
            <IconBase
              size={this.props.size}
              icon={settings}
              style={{
                transform: `rotate(${rotations *
                  360}deg) scale(${scale}, ${scale})`,
                color: chroma
                  .interpolate(this.props.color, this.props.hoverColor, color)
                  .hex(),
              }}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.props.action}
            />
          </Wrapper>
        )}
      </Motion>
    );
  }
}

const Wrapper = styled.div`
  cursor: pointer;
`;

export default SettingsButton;
