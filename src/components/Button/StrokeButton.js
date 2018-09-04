// @flow
import React, { Component } from 'react';

import { COLORS } from '../../constants';

import CircularOutline from '../CircularOutline';
import ButtonBase from './ButtonBase';

type Props = {
  color1: string,
  color2: string,
  showStroke: boolean,
  children: React$Node,
};

class StrokeButton extends Component<Props> {
  static defaultProps = {
    color1: COLORS.purple[500],
    color2: COLORS.violet[500],
    showStroke: true,
  };

  render() {
    const { color1, color2, showStroke, children, ...delegated } = this.props;

    return (
      <ButtonBase background="transparent" {...delegated}>
        <CircularOutline
          isShown={showStroke}
          animateChanges
          color1={color1}
          color2={color2}
        />

        <span style={{ display: 'block' }}>{children}</span>
      </ButtonBase>
    );
  }
}

export default StrokeButton;
