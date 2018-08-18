import React, { Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

import Heading from '../src/components/Heading';
import { contrastingColor } from '../src/utils';
import { COLORS as guppyColors } from '../src/constants';
import { default as materialColors } from 'material-colors/dist/colors';

// `material-colors` provides icon color guides as well, but
// we don't really need them as they're just repeats of the
// `grey` values
delete materialColors.darkIcons;
delete materialColors.lightIcons;

const info = {
  common: (
    <p>
      These colors are commonly used throughout Guppy. If you are adding a new
      component or changing the design of an existing component, try to
      incorporate these colors first before looking to others.
    </p>
  ),
  all: (
    <p>
      The following colors make up Google's{' '}
      <a href="https://material.io/tools/color/">Material Design</a> palette. If
      you are adding a new component or changing the design of an existing
      component, try to incorporate one of the colors listed in the{' '}
      <strong>Common</strong> section first before resorting to these colors. If
      you do decide to use a color from this palette that we do not currently
      use, make sure to add it to the <code>COLORS</code> constant in{' '}
      <code>constants.js</code> and import/reference it from there.
    </p>
  ),
};

const styles = {
  container: { margin: '-1em', padding: '1em', background: '#eee' },
  heading: { marginTop: '20px', marginBottom: '10px' },
  colorBlock: color => ({ background: color, color: contrastingColor(color) }),
};

// `colors` will be an array of the regular and alternate interval values
const SplitColorSwatch = ({ colors, interval }) => (
  <SplitColorBlock>
    <ColorBlock style={styles.colorBlock(colors[0])}>{interval}</ColorBlock>
    <ColorBlock style={styles.colorBlock(colors[1])}>
      {interval} (alternate)
    </ColorBlock>
  </SplitColorBlock>
);

class ColorSwatches extends Component {
  // `material-colors` provides color gradients in the following
  // format:
  //
  //   {
  //     100: '...',
  //     a100: '...'
  //   }
  //
  // where `a100` is the alternate shade of `100`. In order
  // to display them in a useful way, we replace the regular
  // interval entry with an array that contains both the regular
  // entry and the alternate entry, and then display them side-
  // by-side using a SplitColorSwatch
  combineAlternates = gradient => {
    const combinedGradient = {};

    Object.keys(gradient).forEach(alternateInterval => {
      if (alternateInterval.charAt(0) !== 'a') {
        combinedGradient[alternateInterval] = gradient[alternateInterval];
        return;
      }

      const regularInterval = alternateInterval.substring(1);
      combinedGradient[regularInterval] = [
        gradient[regularInterval],
        gradient[alternateInterval],
      ];
    });

    return combinedGradient;
  };

  // Combine regular and alternate entries in the gradient
  // and then render them with a SplitColorSwatch
  renderWithAlternates = gradient => {
    gradient = this.combineAlternates(gradient);

    return Object.entries(gradient).map(
      ([interval, color], i) =>
        Array.isArray(color) ? (
          <SplitColorSwatch key={i} colors={color} interval={interval} />
        ) : (
          <ColorBlock key={i} style={styles.colorBlock(color)}>
            {interval}
          </ColorBlock>
        )
    );
  };

  // A couple colors (white and black) simply provide a single
  // color value instead of a gradient, so just render them as
  // a single swatch
  renderSection = gradientOrColor => {
    return typeof gradientOrColor === 'string' ? (
      <ColorBlock style={styles.colorBlock(gradientOrColor)}>
        {gradientOrColor}
      </ColorBlock>
    ) : (
      this.renderWithAlternates(gradientOrColor)
    );
  };

  render() {
    const { colors, info } = this.props;
    return (
      <div style={styles.container}>
        <InfoBlock>{info}</InfoBlock>
        {Object.entries(colors).map(([name, gradientOrColor], i) => (
          <Fragment key={i}>
            <Heading style={styles.heading}>{name}</Heading>
            {this.renderSection(gradientOrColor)}
          </Fragment>
        ))}
      </div>
    );
  }
}

const InfoBlock = styled.div`
  font-size: 18px;

  code {
    background: ${materialColors.grey[400]};
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const SplitColorBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

const ColorBlock = styled.div`
  flex: 1;
  border: 1px solid ${guppyColors.gray[200]};
  border-radius: 4px;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

storiesOf('Colors', module)
  .add('Common', () => (
    <ColorSwatches colors={guppyColors} info={info.common} />
  ))
  .add('All', () => <ColorSwatches colors={materialColors} info={info.all} />);
