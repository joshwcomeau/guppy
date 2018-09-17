// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import importAll from 'import-all.macro';

import * as actions from '../../actions';

import { COLORS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { isQueueEmpty } from '../../reducers/queue.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import FormField from '../FormField';
import SelectableImage from '../SelectableImage';
import TextInput from '../TextInput';

import type { Project } from '../../types';

const icons: Array<mixed> = importAll.sync(
  '../../assets/images/icons/icon_*.*'
);
const iconSrcs: Array<string> = Object.values(icons).map(src => String(src));

type Props = {
  project: Project | null,
  isVisible: boolean,
  dependenciesChangingForProject: ?boolean,
  hideModal: () => void,
  saveProjectSettings: (string, string, Project) => void,
};

type State = {
  newName: string,
  projectIcon: string,
  activeField: string,
};

class ProjectConfigurationModal extends PureComponent<Props, State> {
  state = {
    newName: '',
    projectIcon: '',
    activeField: 'projectName',
  };

  componentWillReceiveProps(nextProps) {
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

  updateProjectIcon = (ev, src: string) => {
    ev.preventDefault();

    this.setState(prevState => ({
      projectIcon: src,
    }));
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
              <ProjectIconWrapper>
                {iconSrcs.map((src: string) => (
                  <SelectableImageWrapper key={src}>
                    <SelectableImage
                      src={src}
                      size={60}
                      onClick={ev => this.updateProjectIcon(ev, src)}
                      status={
                        projectIcon === null
                          ? 'default'
                          : projectIcon === src
                            ? 'highlighted'
                            : 'faded'
                      }
                    />
                  </SelectableImageWrapper>
                ))}
              </ProjectIconWrapper>
            </FormField>

            <Actions>
              <FillButton
                size="large"
                colors={[COLORS.green[700], COLORS.lightGreen[500]]}
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

const ProjectIconWrapper = styled.div`
  margin-top: 16px;
`;

const SelectableImageWrapper = styled.div`
  display: inline-block;
  margin: 0px 10px 10px 0px;
`;

const Actions = styled.div`
  text-align: center;
  padding-bottom: 16px;
`;

const DisabledText = styled.div`
  padding-top: 16px;
  color: ${COLORS.gray[500]};
`;

const mapStateToProps = state => {
  const project = getSelectedProject(state);
  const projectId = project && project.id;

  const dependenciesChangingForProject = isQueueEmpty(state, { projectId });

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
