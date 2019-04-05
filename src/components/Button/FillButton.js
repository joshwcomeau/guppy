// @flow
import React, { Component } from 'react';

import { COLORS, GRADIENTS } from '../../constants';

import ButtonBase from './ButtonBase';

type Props = {
  colors?: Array<string>,
  hoverColors?: Array<string>,
  textColor: string,
  children: React$Node,
  disabled?: boolean,
};

export const wrapColorsInGradient = (colors?: Array<string> | string) => {
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
    colors: GRADIENTS.primary,
    textColor: COLORS.textOnBackground,
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
