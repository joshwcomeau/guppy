import React, { Component } from 'react';
import styled from 'styled-components';

class Modal extends Component {
  render() {
    const { handleClose, title, children } = this.props;

    return (
      <Wrapper>
        <Backdrop onClick={handleClose} />
        <ModalElem>
          <TitleArea>
            {title}
            <Curves viewBox="0 0 300 20" preserveAspectRatio="none">
              <path
                fill="white"
                d={`
                  M 0,10
                  C 100,30 250,-20 300,20
                  L 0,20
                `}
              />
            </Curves>
          </TitleArea>
          <ChildWrapper>{children}</ChildWrapper>
        </ModalElem>
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

const ModalElem = styled.div`
  position: relative;
  z-index: 2;
  width: 400px;
  background: white;
  box-shadow: 0px 6px 60px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: ${BORDER_RADIUS}px;
  padding: 4px;
  transition: height 300ms;
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

export default Modal;
