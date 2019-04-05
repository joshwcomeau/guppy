// @flow
/**
 * TODO: This code duplicates a lot of TwoPaneModal. Should be reconciled :/
 *
 * TODO: Accessibility. There are a lot of a11y things for modals, and this
 * component isn't doing any of them :/
 *
 * TODO: Use a portal to render this at the top-level, to avoid any z-index
 * issues?
 */
import React, { PureComponent, Fragment } from 'react';
import { Spring, animated, config } from 'react-spring';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';

import { COLORS, Z_INDICES } from '../../constants';
import { hasPropChanged } from '../../utils';

import ScrollDisabler from '../ScrollDisabler';

const springConfig = key => {
  switch (key) {
    case 'opacity': {
      return {
        tension: 170,
        friction: 22,
      };
    }
    case 'translateY': {
      return {
        tension: 95,
        friction: 25,
      };
    }
    default: {
      return config.default;
    }
  }
};

type Props = {
  isVisible: boolean,
  width?: number,
  height?: number,
  onDismiss: () => void,
  children: React$Node,
};

type State = {
  outdatedChildren: React$Node,
};

class Modal extends PureComponent<Props, State> {
  static defaultProps = {
    width: 750,
  };

  state = {
    outdatedChildren: null,
  };

  componentWillReceiveProps(nextProps: Props) {
    // When the modal is dismissed, we want to render the "stale" children for
    // a couple hundred milliseconds, until the modal has fully closed.
    // This is to prevent the underlying component from changing as it fades
    // away.
    if (hasPropChanged(this.props, nextProps, 'isVisible')) {
      if (nextProps.isVisible) {
        this.setState({ outdatedChildren: null });
      } else {
        this.setState({ outdatedChildren: this.props.children });
      }
    }
  }

  render() {
    const { isVisible, width, height, onDismiss, children } = this.props;
    const { outdatedChildren } = this.state;

    return (
      <Fragment>
        {isVisible && <ScrollDisabler />}

        <Transition in={isVisible} timeout={300}>
          {transitionState => {
            if (transitionState === 'exited') {
              return null;
            }

            const inTransit =
              transitionState === 'entering' || transitionState === 'exiting';

            const translateY = {
              from: transitionState === 'entering' ? 50 : 0,
              to: transitionState === 'exiting' ? 50 : 0,
            };

            return (
              <Spring
                from={{
                  opacity: inTransit ? 1 : 0,
                  translateY: translateY.from,
                }}
                to={{ opacity: inTransit ? 0 : 1, translateY: translateY.to }}
                config={springConfig}
                native
              >
                {interpolated => (
                  <Wrapper
                    opacity={interpolated.opacity}
                    clickable={!inTransit}
                  >
                    <Backdrop onClick={onDismiss} />
                    <PaneWrapper
                      width={width}
                      height={height}
                      translateY={interpolated.translateY}
                    >
                      {outdatedChildren || children}
                    </PaneWrapper>
                  </Wrapper>
                )}
              </Spring>
            );
          }}
        </Transition>
      </Fragment>
    );
  }
}

const Wrapper = animated(styled.div.attrs({
  style: props => ({
    opacity: props.opacity,
    pointerEvents: props.clickable ? 'auto' : 'none',
  }),
})`
  position: fixed;
  z-index: ${Z_INDICES.modal};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  will-change: opacity;
  /*
    If items are too large to fit in the modal, we want them to be
    scrollable.
  */
  overflow: auto;
`);

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(230, 230, 230, 0.8);
`;

const PaneWrapper = animated(styled.div.attrs({
  style: props => ({
    width: props.width,
    height: props.height,
    transform: `translateY(${props.translateY}px)`,
  }),
})`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 95%;
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.2), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: ${COLORS.lightBackground};
  will-change: transform;
`);

export default Modal;
