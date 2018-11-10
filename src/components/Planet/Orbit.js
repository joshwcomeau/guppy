// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  planetSize: number,
  duration: number,
  delay: number,
  children: React$Node,
};

class PlanetCloud extends Component<Props> {
  static defaultProps = {
    color: '#FFF',
    duration: 50000,
    delay: 0,
  };

  node: ?HTMLElement;

  componentDidMount() {
    const { planetSize, duration, delay } = this.props;
    const { node } = this;

    if (!node) {
      return;
    }

    const orbitAnimationFrames = [
      { transform: `translateX(${planetSize * -1}px)` },
      { transform: `translateX(${planetSize}px)` },
    ];

    const orbitAnimationTiming = {
      duration,
      delay,
      iterations: Infinity,
    };

    // $FlowFixMe
    node.animate(orbitAnimationFrames, orbitAnimationTiming);
  }

  render() {
    const { duration, delay, planetSize, children, ...delegated } = this.props;

    return (
      <Orbiter innerRef={node => (this.node = node)} {...delegated}>
        {children}
      </Orbiter>
    );
  }
}

const Orbiter = styled.div`
  display: inline-block;
`;

export default PlanetCloud;
