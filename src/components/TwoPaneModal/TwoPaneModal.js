// @flow
/**
 * NOTE: This code duplicates a lot of <Modal />.
 *
 * It's 100% possible that this code can be reconciled and combiled, but it's
 * non-trivial (for one thing, it would be hard to imagine it without nested
 * ReactMotion instances, and that could be bad for perf).
 */
import React, { PureComponent } from 'react';
import { Spring, animated, config } from 'react-spring';
import styled from 'styled-components';

import { RAW_COLORS, COLORS, Z_INDICES } from '../../constants';

type Props = {
  leftPane: React$Node,
  rightPane: React$Node,
  backface: React$Node,
  transitionState: 'entering' | 'entered' | 'exiting' | 'exited',
  isFolded: boolean,
  isDismissable: boolean,
  onDismiss: () => void,
};

type State = {
  isBeingDismissed: boolean,
};

const springConfig = key => {
  switch (key) {
    case 'foldCenteringTranslate': {
      return {
        tension: 66,
        friction: 20,
      };
    }
    case 'transitTranslate': {
      return {
        tension: 95,
        friction: 25,
      };
    }
    case 'transitOpacity': {
      return {
        tension: 170,
        friction: 22,
      };
    }
    default: {
      return config.default;
    }
  }
};

class TwoPaneModal extends PureComponent<Props, State> {
  dismiss = () => {
    const { isDismissable } = this.props;

    if (!isDismissable) {
      return;
    }

    this.props.onDismiss();
  };

  render() {
    const {
      isFolded,
      transitionState,
      leftPane,
      rightPane,
      backface,
    } = this.props;

    if (transitionState === 'exited') {
      return null;
    }

    const inTransit =
      transitionState === 'entering' || transitionState === 'exiting';

    const transitTranslate = {
      from: transitionState === 'entering' ? 50 : 0,
      to: transitionState === 'exiting' ? 50 : 0,
    };

    const foldDegrees = {
      from: 0,
      to: isFolded ? 180 : 0,
    };
    const foldCenteringTranslate = {
      from: 0,
      to: isFolded ? -25 : 0,
    };
    const transitOpacity = {
      from: inTransit ? 1 : 0,
      to: inTransit ? 0 : 1,
    };

    return (
      <Spring
        from={{
          foldDegrees: foldDegrees.from,
          foldCenteringTranslate: foldCenteringTranslate.from,
          transitTranslate: transitTranslate.from,
          transitOpacity: transitOpacity.from,
        }}
        to={{
          foldDegrees: foldDegrees.to,
          foldCenteringTranslate: foldCenteringTranslate.to,
          transitTranslate: transitTranslate.to,
          transitOpacity: transitOpacity.to,
        }}
        config={springConfig}
      >
        {interpolated => (
          <Wrapper opacity={interpolated.transitOpacity} clickable={!inTransit}>
            <Backdrop onClick={this.dismiss} />

            <PaneWrapper
              translateX={interpolated.foldCenteringTranslate}
              translateY={interpolated.transitTranslate}
            >
              <LeftHalf foldDegrees={interpolated.foldDegrees}>
                <LeftPaneWrapper
                  style={{
                    pointerEvents: isFolded ? 'none' : 'auto',
                  }}
                >
                  <PaneChildren>{leftPane}</PaneChildren>
                </LeftPaneWrapper>

                <BackfaceWrapper isFolded={isFolded}>
                  {backface}
                </BackfaceWrapper>
              </LeftHalf>

              <RightPaneWrapper
                style={{
                  pointerEvents: isFolded ? 'none' : 'auto',
                }}
              >
                <PaneChildren>{rightPane}</PaneChildren>
              </RightPaneWrapper>
            </PaneWrapper>
          </Wrapper>
        )}
      </Spring>
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

const PaneWrapper = styled.div.attrs({
  style: props => ({
    transform: `translate(
      ${props.translateX}%,
      ${props.translateY}%
    )`,
  }),
})`
  position: relative;
  z-index: 2;
  width: 850px;
  max-width: 93%;
  display: flex;
  will-change: transform;
`;

const LeftHalf = styled.div.attrs({
  style: props => ({
    transform: `perspective(2000px) rotateY(${props.foldDegrees}deg)`,
    pointerEvents: props.isFolded ? 'none' : 'auto',
  }),
})`
  position: relative;
  z-index: 2;
  flex: 1;
  will-change: transform;
  transform-origin: center right;
  transform-style: preserve-3d;
`;

const LeftPaneWrapper = styled.div`
  height: 100%;
  color: ${COLORS.textOnBackground};
  background-image: linear-gradient(
    70deg,
    ${RAW_COLORS.blue[700]},
    ${RAW_COLORS.teal[500]}
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border: 4px solid ${COLORS.textOnBackground};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px 0 0 8px;
`;

const RightPaneWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  background: ${COLORS.lightBackground};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0 8px 8px 0;
`;

const BackfaceWrapper = styled.div.attrs({
  style: props => ({
    pointerEvents: props.isFolded ? 'auto' : 'none',
  }),
})`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotateY(180deg);
  transform-origin: center center;
`;

const PaneChildren = styled.div`
  padding: 30px;
  height: 100%;
`;

export default TwoPaneModal;
