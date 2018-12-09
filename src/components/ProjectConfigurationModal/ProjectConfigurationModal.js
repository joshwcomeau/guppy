// @flow
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
// import { Scrollbars } from 'react-custom-scrollbars';

import * as actions from '../../actions';

import { COLORS } from '../../constants';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getIsQueueEmpty } from '../../reducers/queue.reducer';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
// import Spacer from '../Spacer';
import { FillButton } from '../Button';
import FormField from '../FormField';
import ProjectIconSelection from '../ProjectIconSelection';
import TextInput from '../TextInput';
import ExportToCodesandbox from '../ExportToCodesandbox';
import DisabledText from '../DisabledText';

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

  updateProjectIcon = (src: string, ev) => {
    ev.preventDefault();

    this.setState(prevState => ({
      projectIcon: src,
    }));
  };

  setActive = (name: string) => {
    console.log('setting', name);
    this.setState(state => ({
      activeField: name,
    }));
  };

  render() {
    const { hideModal, isVisible, dependenciesChangingForProject } = this.props;
    const { activeField, projectIcon } = this.state;

    return (
      <form onSubmit={this.saveSettings}>
        <Modal isVisible={isVisible} onDismiss={hideModal}>
          <ModalHeader title="Project settings">
            <ModalHeader.Controls>
              <Fragment>
                <FillButton
                  size="large"
                  colors={[COLORS.green[700], COLORS.lightGreen[500]]}
                  disabled={dependenciesChangingForProject}
                >
                  Save
                </FillButton>

                {dependenciesChangingForProject && (
                  <DisabledText>
                    Waiting for pending tasks to finish…
                  </DisabledText>
                )}
              </Fragment>
            </ModalHeader.Controls>
          </ModalHeader>

          <MainContent>
            {/* <Scrollbars autoHeight={true} autoHeightMax={'80vh'}> */}
            <FormField label="Project name" focusOnClick={false} spacing={5}>
              <TextInput
                onFocus={() => this.setActive('projectName')}
                onChange={this.changeProjectName}
                onKeyPress={this.handleKeyPress}
                value={this.state.newName}
                isFocused={activeField === 'projectName'}
                autoFocus
              />
            </FormField>

            {/* <Spacer size={5} /> */}

            <FormField
              label="Project Icon"
              focusOnClick={false}
              isFocused={activeField === 'projectIcon'}
              spacing={5}
            >
              <ProjectIconSelection
                selectedIcon={projectIcon}
                onSelectIcon={this.updateProjectIcon}
              />
            </FormField>

            {/* <Spacer size={5} /> */}

            <FormField label="Export" focusOnClick={false} spacing={15}>
              <ExportToCodesandbox
                onFocus={() => this.setActive('exportCodesandbox')}
                isFocused={activeField === 'exportCodesandbox'}
                onBlur={() => this.setActive('')}
              />
            </FormField>
            {/* </Scrollbars> */}
          </MainContent>
        </Modal>
      </form>
    );
  }
}

const MainContent = styled.div`
  padding: 25px;
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
