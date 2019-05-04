// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import * as actions from '../../actions';

import { RAW_COLORS, GRADIENTS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getIsQueueEmpty } from '../../reducers/queue.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import FormField from '../FormField';
import ProjectIconSelection from '../ProjectIconSelection';
import TextInput from '../TextInput';

import type { Project } from '../../types';
import type { Dispatch } from '../../actions/types';

type Props = {
  project: Project | null,
  isVisible: boolean,
  dependenciesChangingForProject: boolean,
  hideModal: Dispatch<typeof actions.hideModal>,
  saveProjectSettings: Dispatch<typeof actions.saveProjectSettingsStart>,
};

type State = {
  newName: string,
  projectIcon: string,
  activeField: string,
};

export const initialState = {
  newName: '',
  projectIcon: '',
  activeField: 'projectName',
};

export class ProjectConfigurationModal extends PureComponent<Props, State> {
  state = initialState;

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.project) {
      return;
    }
    this.setState({
      newName: nextProps.project.name,
      projectIcon: nextProps.project.icon,
    });
  }

  saveSettings = (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    const { saveProjectSettings, project } = this.props;
    if (!project) {
      return;
    }
    const { newName, projectIcon } = this.state;

    saveProjectSettings(newName, projectIcon, project);
  };

  changeProjectName = (ev: SyntheticKeyboardEvent<*>) => {
    this.setState({
      newName: ev.currentTarget.value,
    });
  };

  handleKeyPress = (ev: SyntheticKeyboardEvent<*>) => {
    // When pressing the "enter" key, we want to submit the form.
    // This doesn't happen automatically because we're using buttons for the
    // project icons, and so it delegates the keypress to the first icon,
    // instead of to the submit button at the end.
    if (ev.key === 'Enter') {
      this.saveSettings(ev);
      return;
    }
  };

  updateProjectIcon = (src: string, ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    this.setState({
      projectIcon: src,
    });
  };

  setActive = (name: string) => {
    this.setState(state => ({
      activeField: name,
    }));
  };

  render() {
    const { hideModal, isVisible, dependenciesChangingForProject } = this.props;
    const { activeField } = this.state;
    const { projectIcon } = this.state;

    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
        <ModalHeader title="Project settings" />

        <MainContent>
          <form onSubmit={this.saveSettings}>
            <FormField label="Project name" focusOnClick={false}>
              <TextInput
                onFocus={() => this.setActive('projectName')}
                onChange={this.changeProjectName}
                onKeyPress={this.handleKeyPress}
                value={this.state.newName}
                isFocused={activeField === 'projectName'}
                autoFocus
              />
            </FormField>

            <Spacer size={10} />

            <FormField
              label="Project Icon"
              focusOnClick={false}
              isFocused={activeField === 'projectIcon'}
            >
              <ProjectIconSelection
                selectedIcon={projectIcon}
                onSelectIcon={this.updateProjectIcon}
              />
            </FormField>

            <Actions>
              <FillButton
                size="large"
                colors={GRADIENTS.success}
                disabled={dependenciesChangingForProject}
              >
                Save Project
              </FillButton>

              {dependenciesChangingForProject && (
                <DisabledText>
                  Waiting for pending tasks to finish…
                </DisabledText>
              )}
            </Actions>
          </form>
        </MainContent>
      </Modal>
    );
  }
}

const MainContent = styled.section`
  padding: 25px;
`;

const Actions = styled.div`
  text-align: center;
  padding-bottom: 16px;
`;

const DisabledText = styled.div`
  padding-top: 16px;
  color: ${RAW_COLORS.gray[500]};
`;

const mapStateToProps = state => {
  const project = getSelectedProject(state);
  const projectId = project && project.id;

  const dependenciesChangingForProject = !getIsQueueEmpty(state, { projectId });

  return {
    project,
    isVisible: state.modal === 'project-settings',
    dependenciesChangingForProject,
  };
};

export default connect(
  mapStateToProps,
  {
    hideModal: actions.hideModal,
    saveProjectSettings: actions.saveProjectSettingsStart,
  }
)(ProjectConfigurationModal);
