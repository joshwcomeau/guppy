import React, { Component } from 'react';
import styled from 'styled-components';

import Modal from '../Modal';
import CreateNewProjectForm from '../CreateNewProjectForm';

class IntroScreen extends Component {
  state = {
    showCreateNew: false,
  };

  toggleModal = () => {
    this.setState({ showCreateNew: !this.state.showCreateNew });
  };

  handleCreateProject = () => {};

  render() {
    const { showCreateNew } = this.state;

    return (
      <Wrapper>
        <Logo>Guppy</Logo>
        <button onClick={this.toggleModal}>Create new React project</button>

        {showCreateNew && (
          <Modal handleClose={this.toggleModal}>
            <CreateNewProjectForm onComplete={this.handleCreateProject} />
          </Modal>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Logo = styled.div`
  font-size: 42px;
`;

export default IntroScreen;
