import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { startCreatingNewProject } from '../../actions';
import CreateNewProjectWizard from '../CreateNewProjectWizard';

class IntroScreen extends Component {
  state = {
    showCreateNew: false,
  };

  toggleModal = () => {
    this.setState({ showCreateNew: !this.state.showCreateNew });
  };

  handleCreateProject = () => {
    this.toggleModal();
  };

  render() {
    const { startCreatingNewProject } = this.props;
    const { showCreateNew } = this.state;

    return (
      <Wrapper>
        <Logo>Guppy</Logo>

        <button onClick={() => startCreatingNewProject()}>
          Create new React project
        </button>

        <CreateNewProjectWizard
          isVisible={showCreateNew}
          onDismiss={this.toggleModal}
          onCreateProject={this.handleCreateProject}
        />
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

export default connect(
  null,
  { startCreatingNewProject }
)(IntroScreen);
