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
import React, { PureComponent } from 'react';
import { Motion, spring } from 'react-motion';
import Transition from 'react-transition-group/Transition';
import styled from 'styled-components';

import { COLORS, Z_INDICES } from '../../constants';

const translateYSpringSettings = {
  stiffness: 95,
  damping: 25,
};

const opacitySpringSettings = {
  stiffness: 170,
  damping: 22,
};

type Props = {
  isVisible: boolean,
  width?: number,
  onDismiss: () => void,
  children: React$Node,
};

class Modal extends PureComponent<Props> {
  static defaultProps = {
    width: 750,
  };

  render() {
    const { isVisible, width, onDismiss, children } = this.props;

    return (
      <Transition in={isVisible} timeout={300}>
        {transitionState => {
          if (transitionState === 'exited') {
            return null;
          }

          const inTransit =
            transitionState === 'entering' || transitionState === 'exiting';

          // prettier-ignore
          const translateY =
              (transitionState === 'entering' || transitionState === 'exited')
                ? 50
                : transitionState === 'exiting'
                  ? -50
                  : 0;

          return (
            <Motion
              style={{
                translateY: spring(translateY, translateYSpringSettings),
                opacity: spring(inTransit ? 0 : 1, opacitySpringSettings),
              }}
            >
              {({ translateY, opacity }) => (
                <Wrapper opacity={opacity} clickable={!inTransit}>
                  <Backdrop onClick={onDismiss} />

                  <PaneWrapper style={{ width }} translateY={translateY}>
                    {children}
                  </PaneWrapper>
                </Wrapper>
              )}
            </Motion>
          );
        }}
      </Transition>
    );
  }
}

const Wrapper = styled.div.attrs({
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
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(230, 230, 230, 0.8);
`;

const PaneWrapper = styled.div.attrs({
  style: props => ({
    transform: `translateY(${props.translateY}%)`,
  }),
})`
  position: relative;
  z-index: 2;
  max-width: 100%;
  display: flex;
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.2), 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 30px;
  background: ${COLORS.white};
  will-change: transform;
`;

export default Modal;
