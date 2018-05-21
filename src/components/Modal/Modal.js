import React, { Component } from 'react';
import styled from 'styled-components';

class Modal extends Component {
  render() {
    const { handleClose, children } = this.props;

    return (
      <Wrapper>
        <Backdrop onClick={handleClose} />
        <ModalElem>{children}</ModalElem>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Backdrop = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
`;

const ModalElem = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  height: 80vh;
  background: white;
`;

export default Modal;
