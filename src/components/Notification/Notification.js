// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Heading from '../Heading';
import ProgressBar from '../ProgressBar';
import Spacer from '../Spacer';

import guppyLoaderSrc from '../../assets/images/guppy-loader.gif';

import { COLORS } from '../../constants';

import type { Notification as NotificationType } from '../../types';

class Notification extends Component<NotificationType> {
  render() {
    const { title, message, progress } = this.props;
    return (
      <Container>
        {typeof progress !== 'undefined' ? (
          <Spacer size={4} />
        ) : (
          <ProgressBar height={4} progress={progress} />
        )}
        <InnerContainer>
          <div>
            <Heading size="small">{title}</Heading>
            <span style={{ color: COLORS.gray[500] }}>{message}</span>
          </div>
          <GuppyImage src={guppyLoaderSrc} />
        </InnerContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 450px;
  height: 80px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 10px 42px;
`;

const GuppyImage = styled.img`
  width: 50px;
`;

export default Notification;
