// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Motion, spring } from 'react-motion';
import Notification from '../Notification';
import IconBase from 'react-icons-kit';

import { chevronUp } from 'react-icons-kit/feather/chevronUp';
import { chevronDown } from 'react-icons-kit/feather/chevronDown';
import { COLORS } from '../../constants';

type ScrollSinkProps = {
  scrollTop: number,
  scrollingElementRef: ?HTMLDivElement,
};

class ScrollSink extends Component<ScrollSinkProps> {
  componentDidUpdate(prevProps) {
    const { scrollTop, scrollingElementRef } = this.props;
    if (scrollingElementRef && prevProps.scrollTop !== scrollTop) {
      scrollingElementRef.scrollTop = scrollTop;
    }
  }

  render() {
    return null;
  }
}

type Props = {
  notifications: {},
};

type State = {
  pageIndex: number,
};

class NotificationList extends Component<Props, State> {
  scrollerRef: ?HTMLDivElement;

  state = {
    pageIndex: 0,
  };

  // TODO: convert this to getDerivedStateFromProps
  // TODO: the logic here is incomplete - I have not determined all
  // corner cases yet, but off the top of my head I know this is wrong
  // for moving from 2 notifications to 1, as it sets the index to 0.
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.pageIndex >= Object.keys(nextProps.notifications).length) {
      this.setState({
        pageIndex: Object.keys(nextProps.notifications).length - 1,
      });
    }
  }

  pageUp = () => this.setState(prev => ({ pageIndex: prev.pageIndex - 1 }));
  pageDown = () => this.setState(prev => ({ pageIndex: prev.pageIndex + 1 }));

  render() {
    const { notifications } = this.props,
      { pageIndex } = this.state;

    const notificationEntries = Object.entries(notifications);
    return (
      <Fragment>
        <Scroller
          interactive={notificationEntries.length > 0}
          innerRef={scrollerRef => (this.scrollerRef = scrollerRef)}
        >
          <PageButton
            style={{ top: 20 }}
            onClick={this.pageUp}
            disabled={pageIndex === 0}
          >
            <IconBase size={16} icon={chevronUp} />
          </PageButton>
          <PageLabel>
            {pageIndex + 1} / {notificationEntries.length}
          </PageLabel>
          <PageButton
            style={{ top: 45 }}
            onClick={this.pageDown}
            disabled={pageIndex === notificationEntries.length - 1}
          >
            <IconBase size={16} icon={chevronDown} />
          </PageButton>
          {notificationEntries.map(([id, notification]) => (
            <Notification key={id} {...notification} />
          ))}
        </Scroller>
        <Motion defaultStyle={{ y: 0 }} style={{ y: spring(pageIndex * 80) }}>
          {value => (
            <ScrollSink
              scrollTop={value.y}
              scrollingElementRef={this.scrollerRef}
            />
          )}
        </Motion>
      </Fragment>
    );
  }
}

const Scroller = styled.div`
  pointer-events: ${props => (props.interactive ? 'auto' : 'none')};
  height: 80px;
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PageLabel = styled.div`
  position: absolute;
  left: 5px;
  top: 36px;
  color: ${COLORS.gray[300]};
  font-size: 8px;
  width: 30px;
  text-align: center;
`;

const PageButton = styled.button`
  position: absolute;
  left: 7px;
  cursor: pointer;
  background: transparent;
  border: none;
  color: ${COLORS.gray[300]};
  &:focus {
    outline: none;
  }
  &:active:not(:disabled) {
    color: ${COLORS.gray[500]};
  }
  &:disabled {
    color: ${COLORS.gray[200]};
  }
`;

const mapStateToProps = state => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps)(NotificationList);
