// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';
import { RAW_COLORS } from '../../constants';

import Heading from '../Heading';
import Spacer from '../Spacer';

type Props = {
  name: string,
  queued: boolean,
};

class DependencyInstalling extends Component<Props> {
  render() {
    const { name, queued } = this.props;
    const stylizedName = (
      <span style={{ color: RAW_COLORS.purple[500] }}>{name}</span>
    );

    return (
      <Wrapper>
        <InnerWrapper>
          <GuppyImage src={guppyLoaderSrc} />
          <Spacer size={50} />
          <Heading size="small">
            {queued ? (
              <Fragment>{stylizedName} is queued for install...</Fragment>
            ) : (
              <Fragment>Installing {stylizedName}...</Fragment>
            )}
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
