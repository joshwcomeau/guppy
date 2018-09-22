// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { getCloudPathFromPoints } from './Planet.helpers';
import Orbit from './Orbit';

type Shape = {
  rows: number,
  columns: number,
  points: Array<number>,
};

type Props = {
  shape: Shape,
  planetSize: number,
  offset: number,
  color: string,
  opacity: number,
  rotation: number,
  orbitDuration: number,
  orbitDelay: number,
};

class PlanetCloud extends Component<Props> {
  static defaultProps = {
    color: '#FFF',
    offset: 0,
    opacity: 0.9,
    rotation: -10,
    orbitDuration: 50000,
    orbitDelay: 0,
  };

  node: ?HTMLElement;

  render() {
    const {
      shape: { rows, columns, points },
      planetSize,
      offset,
      opacity,
      color,
      rotation,
      orbitDuration,
      orbitDelay,
    } = this.props;

    const path = getCloudPathFromPoints(points);

    // The path generated will be based on a square grid, with a number of
    // rows and columns specified by the shape.
    // If a planet has multiple clouds, we want to ensure that each cell in that
    // grid is the same size; A cloud with 10 rows should be twice the height
    // of one with 5 rows, given the same planet size.
    const RATIO_BETWEEN_PLANET_SIZE_AND_ROW_HEIGHT = 0.1;
    const height = planetSize * RATIO_BETWEEN_PLANET_SIZE_AND_ROW_HEIGHT * rows;

    const width = height * (columns / rows);

    return (
      <Wrapper opacity={opacity} offset={offset} rotation={rotation}>
        <Orbit
          planetSize={planetSize}
          duration={orbitDuration}
          delay={orbitDelay}
        >
          <svg width={width} height={height} viewBox={`0 0 ${columns} ${rows}`}>
            <path d={path} fill={color} />
          </svg>
        </Orbit>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${props => props.opacity};
  transform: translateY(${props => props.offset}px)
    rotate(${props => props.rotation}deg);
`;

export default PlanetCloud;
