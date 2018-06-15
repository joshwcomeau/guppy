// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { COLORS } from '../../constants';

import Heading from '../Heading';
import Spacer from '../Spacer';

type Props = {
  name: string,
};

class DependencyInstalling extends Component<Props> {
  render() {
    const { name } = this.props;

    return (
      <Wrapper>
        <InnerWrapper>
          <GuppyImage src={guppyLoaderSrc} />
          <Spacer size={50} />
          <Heading size="small">
            Installing <span style={{ color: COLORS.purple[500] }}>{name}</span>…
          </Heading>
        </InnerWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InnerWrapper = styled.div`
  text-align: center;
`;

const GuppyImage = styled.img`
  width: 148px;
`;

export default DependencyInstalling;
