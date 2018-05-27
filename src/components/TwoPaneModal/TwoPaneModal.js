// @flow
import React, { PureComponent } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS } from '../../constants';

type Props = {
  leftPane: React$Node,
  rightPane: React$Node,
  backface: React$Node,
  isFolded: boolean,
  handleClose: () => void,
};

const springSettings = {
  stiffness: 66,
  damping: 20,
};

class TwoPaneModal extends PureComponent<Props> {
  render() {
    const { handleClose, isFolded, leftPane, rightPane, backface } = this.props;

    return (
      <Wrapper>
        <Backdrop onClick={handleClose} />

        <Motion
          style={{
            foldDegrees: spring(isFolded ? 180 : 0, springSettings),
            translatePercentage: spring(isFolded ? -25 : 0, springSettings),
          }}
        >
          {({ foldDegrees, translatePercentage }) => (
            <PaneWrapper translatePercentage={translatePercentage}>
              <LeftHalf foldDegrees={foldDegrees}>
                <LeftPaneWrapper>
                  <PaneChildren>{leftPane}</PaneChildren>
                </LeftPaneWrapper>

                <BackfaceWrapper>{backface}</BackfaceWrapper>
              </LeftHalf>

              <RightPaneWrapper>
                <PaneChildren>{rightPane}</PaneChildren>
              </RightPaneWrapper>
            </PaneWrapper>
          )}
        </Motion>
      </Wrapper>
    );
  }
}

const BORDER_RADIUS = 8;

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
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

const PaneWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 80%;
  max-width: 850px;
  display: flex;
  transform: translateX(${props => props.translatePercentage}%);
  will-change: transform;
`;

const OverflowManager = styled.div`
  overflow: hidden;
`;

const LeftHalf = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  transform: perspective(2000px) rotateY(${props => props.foldDegrees}deg);
  will-change: transform;
  transform-origin: center right;
  transform-style: preserve-3d;
`;

const LeftPaneWrapper = styled.div`
  height: 100%;
  color: ${COLORS.white};
  background-image: linear-gradient(
    70deg,
    ${COLORS.blue[700]},
    ${COLORS.teal[500]}
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border: 4px solid ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px 0 0 8px;
  backface-visibility: hidden;
`;

const RightPaneWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  background: ${COLORS.white};
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 0 8px 8px 0;
`;

const BackfaceWrapper = styled.div`
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotateY(180deg);
  transform-origin: center center;
  backface-visibility: hidden;
`;

const PaneChildren = styled.div`
  padding: 30px;
  height: 100%;
`;

const ChildWrapper = styled.div`
  padding: 25px;
`;

const TitleArea = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  padding: 22px 25px;
  height: 170px;
  background: rgb(7, 23, 61);
  background: linear-gradient(
    113deg,
    rgba(7, 23, 61, 1) 0%,
    rgba(50, 38, 105, 1) 72%,
    rgba(60, 33, 85, 1) 100%
  );
  font-size: 36px;
  font-weight: 400;
  color: white;
  border-radius: ${BORDER_RADIUS - 4}px ${BORDER_RADIUS - 4}px 0px 0px;
`;

const Curves = styled.svg`
  position: absolute;
  left: -1px;
  right: -1px;
  bottom: -1px;
  width: calc(100% + 2px);
  overflow: visile;
  display: none;
`;

export default TwoPaneModal;
