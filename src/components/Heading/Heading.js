// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  size: 'small' | 'medium' | 'large',
  children: React$Node,
};

class Heading extends Component<Props> {
  static defaultProps = {
    size: 'medium',
  };
  render() {
    const { size, ...delegated } = this.props;

    switch (this.props.size) {
      case 'small':
        return <HeadingSmall {...delegated} />;
      case 'medium':
      default:
        return <HeadingMedium {...delegated} />;
      case 'large':
        return <HeadingLarge {...delegated} />;
    }
  }
}

const HeadingMedium = styled.h3`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: ${COLORS.gray[800]};
`;

const HeadingSmall = HeadingMedium.withComponent('h5').extend`
  font-size: 20px;
  letter-spacing: 0px;
`;
const HeadingLarge = HeadingMedium.withComponent('h1').extend`
  font-size: 42px;
  letter-spacing: -1px;
`;

export default Heading;
