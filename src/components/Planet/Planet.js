// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  x: number,
  y: number,
  size: number,
  angle: number,
  background: string,
  groundColor?: string,
  shine?: boolean,
  atmosphere?: number,
  glow?: (size: number) => React$Node,
  clouds?: (size: number) => React$Node,
  rings?: (size: number) => React$Node,
  land?: (size: number) => React$Node,
  moons?: (size: number) => React$Node,
};

class Planet extends Component<Props> {
  static defaultProps = {
    size: 100,
    angle: 75,
    background: 'red',
  };

  render() {
    const {
      x,
      y,
      size,
      angle,
      background,
      atmosphere,
      rings,
      moons,
      glow,
      land,
      clouds,
    } = this.props;

    return (
      <Wrapper x={x} y={y} size={size} angle={angle}>
        {atmosphere && (
          <Atmosphere
            strength={atmosphere}
            background={background}
            style={{ transform: `rotateX(${angle * -1}deg` }}
          />
        )}
        <PlanetElem
          background={background}
          style={{ transform: `rotateX(${angle * -1}deg` }}
        >
          {land && land(size)}
          {glow && glow(size)}
          {clouds && clouds(size)}
        </PlanetElem>

        <Rings>{rings && rings(size)}</Rings>
        {moons && moons(size)}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  transform: translate(-50%, -50%) rotateX(${props => props.angle}deg);
  transform-style: preserve-3d;
`;

const PlanetElem = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${props => props.background};
  border-radius: 50%;
  overflow: hidden;
`;

const Atmosphere = styled.div`
  position: absolute;
  z-index: 0;
  width: 110%;
  height: 110%;
  top: -5%;
  left: -5%;
  background: ${props => props.background};
  opacity: ${props => props.strength};
  border-radius: 50%;
`;

const Rings = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-style: preserve-3d;
`;

export default Planet;
