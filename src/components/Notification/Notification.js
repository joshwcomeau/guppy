// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Heading from '../Heading';
import ProgressBar from '../ProgressBar';
import Spacer from '../Spacer';
import Spinner from '../Spinner';
import IconBase from 'react-icons-kit';
import { checkCircle } from 'react-icons-kit/feather/checkCircle';
import { xCircle } from 'react-icons-kit/feather/xCircle';

import { COLORS } from '../../constants';

import type { Notification as NotificationType } from '../../types';

class Notification extends Component<NotificationType> {
  render() {
    const { title, message, progress, complete, error } = this.props;
    return (
      <Container>
        {typeof progress !== 'undefined' ? (
          <ProgressBar height={4} progress={progress} />
        ) : (
          <Spacer size={4} />
        )}
        <InnerContainer>
          <div>
            <Heading size="small">{title}</Heading>
            <span style={{ color: COLORS.gray[500] }}>{message}</span>
          </div>
          <Action
            style={{
              color: complete
                ? COLORS.green[500]
                : error
                  ? COLORS.red[500]
                  : COLORS.gray[300],
            }}
          >
            {complete ? (
              <IconBase icon={checkCircle} size={35} />
            ) : error ? (
              <IconBase icon={xCircle} size={35} />
            ) : (
              <Spinner size={35} />
            )}
          </Action>
        </InnerContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  height: 80px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px 10px 42px;
`;

const Action = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 50px;
`;

export default Notification;
