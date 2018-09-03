// @flow
import React, { Component } from 'react';

import { COLORS } from '../../constants';

import ButtonBase from './ButtonBase';

type Props = {
  colors?: Array<string>,
  hoverColors?: Array<string>,
  textColor: string,
  children: React$Node,
};

const wrapColorsInGradient = colors => {
  if (!Array.isArray(colors)) {
    return colors;
  }

  if (colors.length === 1) {
    return colors[0];
  }

  return `linear-gradient(
    45deg,
    ${colors.join(',')}
  )`;
};

class FillButton extends Component<Props> {
  static defaultProps = {
    colors: [COLORS.purple[500], COLORS.violet[500]],
    textColor: COLORS.white,
  };

  render() {
    const { colors, hoverColors, children, ...delegated } = this.props;

    const background = wrapColorsInGradient(colors);
    const hoverBackground = wrapColorsInGradient(hoverColors) || background;

    return (
      <ButtonBase
        activeSplat
        background={background}
        hoverBackground={hoverBackground}
        {...delegated}
      >
        {children}
      </ButtonBase>
    );
  }
}

export default FillButton;
