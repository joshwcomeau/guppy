// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Card from '../Card';
import NotificationList from '../NotificationList';

type Props = {};

class NotificationWindow extends Component<Props> {
  render() {
    return (
      <Overlay>
        <Container>
          <NotificationList />
        </Container>
      </Overlay>
    );
  }
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px;
  background-color: transparent;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  z-index: 100;
`;

const Container = styled(Card)`
  position: relative;
  overflow: hidden;
  padding: 0;
  pointer-events: auto;
`;

export default NotificationWindow;
