// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

type Props = {
  size: 'small' | 'medium' | 'large',
  grayscale: boolean,
};

class Logo extends Component<Props> {
  render() {
    const { size, grayscale } = this.props;

    return (
      <LogoElem size={size} grayscale={grayscale}>
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        🐠
      </LogoElem>
    );
  }
}

const getFontSize = ({ size }) => {
  switch (size) {
    case 'small':
      return 24;
    default:
    case 'medium':
      return 48;
    case 'large':
      return 96;
  }
};

const LogoElem = styled.div`
  font-size: ${getFontSize}px;
  filter: grayscale(${props => (props.grayscale ? '90%' : '0%')});
  cursor: default;
`;

export default Logo;
