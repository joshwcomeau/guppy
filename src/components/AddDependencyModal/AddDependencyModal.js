// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';

type Props = {
  isVisible: boolean,
  onDismiss: () => void,
};

class AddDependencyModal extends Component<Props> {
  render() {
    const { isVisible, onDismiss } = this.props;

    return (
      <Modal width={620} isVisible={isVisible} onDismiss={onDismiss}>
        <ModalHeader title="Add New Dependency" />
        <MainContent>Hello World</MainContent>
      </Modal>
    );
  }
}

const MainContent = styled.div`
  padding: 25px;
`;

export default AddDependencyModal;
