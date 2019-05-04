// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { RAW_COLORS } from '../../constants';

type Props = {
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge',
  children: React$Node,
};

class Heading extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };
  render() {
    const { size, ...delegated } = this.props;

    switch (this.props.size) {
      case 'xsmall':
        return <HeadingXSmall {...delegated} />;
      case 'small':
        return <HeadingSmall {...delegated} />;
      case 'medium':
      default:
        return <HeadingMedium {...delegated} />;
      case 'large':
        return <HeadingLarge {...delegated} />;
      case 'xlarge':
        return <HeadingXLarge {...delegated} />;
    }
  }
}

const HeadingXSmall = styled.h6`
  font-size: 21px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: ${RAW_COLORS.gray[800]};
`;

const HeadingSmall = HeadingXSmall.withComponent('h3').extend`
  font-size: 26px;
`;

const HeadingMedium = HeadingSmall.withComponent('h3').extend`
  font-size: 32px;
  letter-spacing: -0.5px;
`;

const HeadingLarge = HeadingSmall.withComponent('h1').extend`
  font-size: 42px;
  letter-spacing: -1px;
`;

const HeadingXLarge = HeadingSmall.withComponent('h1').extend`
  font-size: 60px;
  letter-spacing: -2px;
`;

export default Heading;
