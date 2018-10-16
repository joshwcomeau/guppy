// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import produce from 'immer';

import * as actions from '../../actions';
import { getProjectHomePath } from '../../reducers/paths.reducer';
import { COLORS } from '../../constants';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import FormField from '../FormField';
// import TextInput from '../TextInput';
import DirectoryPicker from '../DirectoryPicker';
import ProjectTypeSelection from '../ProjectTypeSelection';

import type { AppSettings, Project, ProjectType } from '../../types';

type Props = {
  project: Project | null,
  isVisible: boolean,
  dependenciesChangingForProject: boolean,
  hideModal: () => void,
  saveProjectSettings: (string, string, Project) => void,
};

type State = {
  newSettings: AppSettings,
  activeField: string,
};

class AppSettingsModal extends PureComponent<Props, State> {
  state = {
    newSettings: this.props.settings,
  };

  // componentWillReceiveProps(nextProps) {
  //   if (!nextProps.project) {
  //     return;
  //   }
  //   this.setState({
  //     newName: nextProps.project.name,
  //     projectIcon: nextProps.project.icon,
  //   });
  // }

  saveSettings = (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    const { saveAppSettings } = this.props;
    // if (!project) {
    //   return;
    // }
    const { newSettings } = this.state;

    saveAppSettings(newSettings);
  };

  // changeProjectName = (ev: SyntheticKeyboardEvent<*>) => {
  //   this.setState({
  //     newName: ev.currentTarget.value,
  //   });
  // };

  // handleKeyPress = (ev: SyntheticKeyboardEvent<*>) => {
  //   // When pressing the "enter" key, we want to submit the form.
  //   // This doesn't happen automatically because we're using buttons for the
  //   // project icons, and so it delegates the keypress to the first icon,
  //   // instead of to the submit button at the end.
  //   if (ev.key === 'Enter') {
  //     this.saveSettings(ev);
  //     return;
  //   }
  // };

  // updateProjectIcon = (src: string, ev) => {
  //   ev.preventDefault();

  //   this.setState(prevState => ({
  //     projectIcon: src,
  //   }));
  // };

  setActive = (name: string) => {
    this.setState(state => ({
      activeField: name,
    }));
  };

  selectDefaultProjectPath = selectedPath => {
    this.setState(
      produce(draftState => {
        draftState.newSettings.general.defaultProjectPath = selectedPath;
      })
    );
  };

  selectDefaultProjectType = (projectType: ProjectType) => {
    this.setState(
      produce(draftState => {
        draftState.newSettings.general.defaultProjectType = projectType;
      })
    );
  };

  render() {
    const { hideModal, isVisible } = this.props;
    const newSettings = this.state.newSettings;
    // const { activeField } = this.state;
    // const { projectIcon } = this.state;
    console.log(
      'appsettings modal render',
      this.state.newSettings.general.defaultProjectPath
    );
    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
        <ModalHeader title="Preferences" />

        <MainContent>
          <pre>{JSON.stringify(this.state.newSettings, null, 2)}</pre>
          <form onSubmit={this.saveSettings}>
            {/* // todo: Refactor to map over settings so this renders dynamically -
                         needs additional info on state e.g. component for rendering + props
                         -> For now it's OK to hard code as we're only having three
                            settings 
            */}
            <SectionTitle>General</SectionTitle>
            <FormField label="Default Project Path" focusOnClick={false}>
              <Spacer size={5} />
              <DirectoryPicker
                path={newSettings.general.defaultProjectPath}
                onSelect={this.selectDefaultProjectPath}
              />
            </FormField>

            <FormField label="Default Project Type" focusOnClick={false}>
              <Spacer size={5} />
              <ProjectTypeSelection
                projectType={newSettings.general.defaultProjectType}
                onSelect={this.selectDefaultProjectType}
              />
            </FormField>

            <Spacer size={10} />
            <Actions>
              <FillButton
                size="large"
                colors={[COLORS.green[700], COLORS.lightGreen[500]]}
              >
                Save
              </FillButton>
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

const SectionTitle = styled.h2`
  padding-bottom: 8px;
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
  return {
    projectHomePath: getProjectHomePath(state),
    settings: state.appSettings,
    isVisible: state.modal === 'app-settings',
  };
};

export default connect(
  mapStateToProps,
  {
    hideModal: actions.hideModal,
    saveAppSettings: actions.saveAppSettingsStart,
  }
)(AppSettingsModal);
