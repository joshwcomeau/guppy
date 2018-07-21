// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import FadeIn from '../FadeIn';
import SlideIn from '../SlideIn';
import Card from '../Card';
import NotificationList from '../NotificationList';

type Props = {
  notifications: Object,
};

class NotificationWindow extends Component<Props> {
  initialRender: boolean;

  constructor(props, context) {
    super(props, context);
    this.initialRender = true;
  }

  componentDidMount() {
    this.initialRender = false;
  }

  render() {
    const { notifications } = this.props;
    const out = Object.keys(notifications).length === 0;

    // this.initialRender will be true only during the first render - if during the
    // first render there are no notifications, don't render the SlideIn animation
    // because it will flash in a blank window
    return (
      <Overlay>
        {this.initialRender && out ? null : (
          <SlideIn out={out}>
            <FadeIn out={out}>
              <Container>
                <NotificationList />
              </Container>
            </FadeIn>
          </SlideIn>
        )}
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
  width: 450px;
`;

const mapStateToProps = state => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps)(NotificationWindow);
