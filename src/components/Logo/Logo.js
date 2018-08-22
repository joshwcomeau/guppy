// @flow
import React, { Component } from 'react';

import guppyLogoSrc from '../../assets/images/guppy-logo.svg';

type Size = 'small' | 'medium' | 'large';

type Props = {
  size?: Size,
  grayscale?: boolean,
};

class Logo extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    const { size, grayscale } = this.props;

    const desaturationAmount = grayscale ? 90 : 0;

    return (
      <img
        src={guppyLogoSrc}
        alt="Guppy logo"
        aria-roledescription="logo"
        style={{
          width: getLogoWidth(size),
          filter: `grayscale(${desaturationAmount}%)`,
        }}
      />
    );
  }
}

const getLogoWidth = (size: ?Size) => {
  switch (size) {
    case 'small':
      return 24;
    case 'medium':
      return 48;
    case 'large':
      return 96;
    default:
      throw new Error('Unrecognized size for logo');
  }
};

export default Logo;
