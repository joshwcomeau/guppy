import React, { Component } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { settings } from 'react-icons-kit/feather/settings';
import { COLORS } from '../../constants';
import type { Project } from '../../types';

import ProjectConfigurationModal from '../ProjectConfigurationModal';

type Props = {
  project: Project,
};

type State = {
  showModal: boolean,
};

class ProjectConfigurationButton extends Component<Props, State> {
  state = {
    showModal: false,
  };

  displaySettings = () => {
    this.setState({
      showModal: true,
    });
  };

  handleDismiss = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    return (
      <Wrapper>
        <Button
          size="30"
          color1="rgba(255, 255, 255, 0.1)"
          color2="rgba(255, 255, 255, 0.1)"
          onClick={this.displaySettings}
        >
          <IconWrapper>
            <IconBase
              size={30}
              icon={settings}
              style={{ color: COLORS.GRAY }}
            />
          </IconWrapper>
        </Button>
        <ProjectConfigurationModal
          project={this.props.project}
          isVisible={!!this.state.showModal}
          onDismiss={this.handleDismiss}
        />
      </Wrapper>
    );
  }
}

const Button = styled.button`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  transform: translate(1px, 2px);
`;

const Wrapper = styled.div`
  margin-top: -60px;
  float: right;
`;

export default ProjectConfigurationButton;
