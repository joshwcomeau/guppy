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
import Toggle from '../Toggle';

// import TextInput from '../TextInput';
import DirectoryPicker from '../DirectoryPicker';
import ProjectTypeSelection from '../ProjectTypeSelection';

import type { AppSettings, ProjectType } from '../../types';

type Props = {
  isVisible: boolean,
  settings: AppSettings,
  hideModal: () => void,
  saveAppSettings: (newSettings: AppSettings) => void,
};

type State = {
  newSettings: AppSettings,
  // activeField: string,
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
    const { newSettings } = this.state;

    saveAppSettings(newSettings);
  };

  // setActive = (name: string) => {
  //   this.setState(state => ({
  //     activeField: name,
  //   }));
  // };

  // todo: refactor state update methods into single method & use dotty https://www.npmjs.com/package/dotty
  //       method params keyString, value
  //       --> keyString = general.defaultProjectPath
  selectDefaultProjectPath = (selectedPath): AppSettings => {
    this.setState(
      produce(draftState => {
        draftState.newSettings.general.defaultProjectPath = selectedPath;
      })
    );
  };

  selectDefaultProjectType = (projectType: ProjectType): AppSettings => {
    this.setState(
      produce(draftState => {
        draftState.newSettings.general.defaultProjectType = projectType;
      })
    );
  };

  toggleUsageTracking = (enableUsageTracking: boolean): AppSettings => {
    this.setState(
      produce(draftState => {
        draftState.newSettings.privacy.enableUsageTracking = enableUsageTracking;
      })
    );
  };

  render() {
    const { hideModal, isVisible } = this.props;
    const newSettings = this.state.newSettings;
    // const { activeField } = this.state;
    // const { projectIcon } = this.state;
    return (
      <Modal isVisible={isVisible} onDismiss={hideModal}>
        <ModalHeader title="Preferences" />

        <MainContent>
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

            <SectionTitle>Privacy</SectionTitle>
            <FormField
              label="Enable anonymous usage tracking"
              focusOnClick={false}
            >
              {/* <Spacer size={5} /> */}
              <Toggle
                isToggled={newSettings.privacy.enableUsageTracking}
                onToggle={this.toggleUsageTracking}
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
