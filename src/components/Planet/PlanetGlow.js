// @flow
import React, { Component } from 'react';

type Props = {
  planetSize: number,
  topColor: string,
  bottomColor: string,
};

class PlanetGlow extends Component<Props> {
  static defaultProps = {
    topColor: '#00b4ff',
    bottomColor: '#001e6a',
  };
  render() {
    const { planetSize, topColor, bottomColor, ...delegated } = this.props;

    return (
      <svg
        width={planetSize}
        height={planetSize}
        style={{ position: 'relative' }}
        viewBox="0 0 20 20"
        {...delegated}
      >
        <defs>
          <filter id="f1" x="-25%" y="-25%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
        </defs>
        <path
          d={`
            M 17,0
            Q 20,15 8,25
            L 25,25
            L 25,0
          `}
          fill={bottomColor}
          filter="url(#f1)"
          style={{ opacity: 0.7 }}
        />
        <path
          d={`
            M 8,0
            Q -5,10 8,25
            L -5,25
            L -5,0
          `}
          fill={topColor}
          filter="url(#f1)"
          style={{ opacity: 0.4 }}
        />
      </svg>
    );
  }
}

export default PlanetGlow;
