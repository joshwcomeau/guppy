// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { BREAKPOINTS } from '../../constants';

type Size = $Keys<typeof BREAKPOINTS>;

type Props = {
  size: Size,
  display: 'inline' | 'block' | 'inline-block',
  children: React$Node,
};

class OnlyOn extends PureComponent<Props> {
  static defaultProps = {
    display: 'inline',
  };

  getElement = (size: Size) => {
    switch (size) {
      case 'sm':
        return LessThanSmall;
      case 'md':
        return LessThanMedium;
      case 'mdMin':
        return MediumAndUp;
      case 'lgMin':
        return LargeAndUp;
      default:
        throw new Error('Unrecognized size to OnlyOn');
    }
  };
  render() {
    const { size, display, children, ...delegated } = this.props;

    const Element = this.getElement(size);

    return (
      <Element display={display} {...delegated}>
        {children}
      </Element>
    );
  }
}

const LessThanSmall = styled.span`
  display: none;
  @media ${BREAKPOINTS.sm} {
    display: ${props => props.display};
  }
`;

const LessThanMedium = styled.span`
  display: none;
  @media ${BREAKPOINTS.md} {
    display: ${props => props.display};
  }
`;

const LargeAndUp = styled.span`
  display: none;
  @media ${BREAKPOINTS.lgMin} {
    display: ${props => props.display};
  }
`;

const MediumAndUp = styled.span`
  display: none;
  @media ${BREAKPOINTS.mdMin} {
    display: ${props => props.display};
  }
`;

export default OnlyOn;
