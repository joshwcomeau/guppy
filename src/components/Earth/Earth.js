// @flow
import React, { Fragment, Component } from 'react';

import {
  Planet,
  PlanetMoon,
  PlanetGlow,
  PlanetCloud,
  EarthContinents,
} from '../Planet';

type Props = {
  size: number,
};

class Earth extends Component<Props> {
  render() {
    return (
      <Planet
        size={this.props.size}
        atmosphere={0.25}
        background="linear-gradient(0deg, #0048ff, #178aff, #01cafe)"
        land={size => <EarthContinents planetSize={size} />}
        glow={size => <PlanetGlow planetSize={size} />}
        moons={size => <PlanetMoon offset={20} planetSize={size} />}
        clouds={size => (
          <Fragment>
            <PlanetCloud
              planetSize={size}
              shape={{
                rows: 3,
                columns: 8,
                points: [1, 6, 6, 7, 2, 2, 1],
              }}
              color="#FFF"
              opacity={0.45}
              orbitDuration={18000}
              orbitDelay={-10000}
              offset={size * 0.2}
            />
            <PlanetCloud
              planetSize={size}
              shape={{
                rows: 5,
                columns: 11,
                points: [1, 6, 6, 10, 9, 9, 3, 4, 2, 2, 1],
              }}
              color="#FFF"
              opacity={0.45}
              orbitDuration={22000}
              orbitDelay={0}
              offset={size * 0.55}
            />
            <PlanetCloud
              planetSize={size}
              shape={{
                rows: 3,
                columns: 10,
                points: [4, 8, 8, 9, 1, 5, 4],
              }}
              color="#FFF"
              opacity={0.4}
              offset={size * 0.1}
              orbitDuration={20000}
              orbitDelay={-1500}
            />
          </Fragment>
        )}
      />
    );
  }
}

export default Earth;
