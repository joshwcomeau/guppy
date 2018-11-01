// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import produce from 'immer';

import * as actions from '../../actions';
import { getDefaultProjectPath } from '../../reducers/app-settings.reducer';
import { COLORS } from '../../constants';
import { setNested } from '../../utils';

import Modal from '../Modal';
import ModalHeader from '../ModalHeader';
import Spacer from '../Spacer';
import { FillButton } from '../Button';
import FormField from '../FormField';
import Toggle from '../Toggle';
import PixelShifter from '../PixelShifter';
import DirectoryPicker from '../DirectoryPicker';
import ProjectTypeSelection from '../ProjectTypeSelection';
import Heading from '../Heading';

import type { AppSettings } from '../../types';

type Props = {
  isVisible: boolean,
  settings: AppSettings,
  hideModal: () => void,
  saveAppSettings: (newSettings: AppSettings) => void,
};

type State = {
  newSettings: AppSettings,
  activeField: string, // todo: Add possible strings to type def. for now string is OK as we're having only one field
};

class AppSettingsModal extends PureComponent<Props, State> {
  state = {
    newSettings: this.props.settings,
    activeField: 'directoryPicker',
  };

  saveSettings = (ev: SyntheticEvent<*>) => {
    ev.preventDefault();

    const { saveAppSettings } = this.props;
    const { newSettings } = this.state;

    saveAppSettings(newSettings);
  };

  // Update setting by key
  // Notice: Key will be nested e.g. 'general.defaultProjectPath' that's why we're using utility function setNested
  updateSetting = (key: string, value: any) => {
    this.setState(state =>
      // produce could be used with currying here - so no state passed to produce. But Flow couldn't detect the right return type.
      produce(state, draftState => {
        setNested(draftState.newSettings, key, value);
      })
    );
  };

  setActive = (field: string) => {
    this.setState({
      activeField: field,
    });
  };

  render() {
    const { hideModal, isVisible } = this.props;
    const { newSettings, activeField } = this.state;

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
            <PixelShifter x={5} reason="Slightly intend in section">
              <FormField label="Default Project Path" focusOnClick={false}>
                <Spacer size={5} />
                <DirectoryPicker
                  onFocus={() => this.setActive('directoryPicker')}
                  inputEditable={true}
                  path={newSettings.general.defaultProjectPath}
                  onSelect={path =>
                    this.updateSetting('general.defaultProjectPath', path)
                  }
                  isFoccussed={activeField === 'directoryPicker'}
                />
              </FormField>
            </PixelShifter>
            <ProjectTypeSelection
              label="Default Project Type"
              onFocus={() => this.setActive('projectType')}
              activeField={activeField}
              projectType={newSettings.general.defaultProjectType}
              onSelect={projectType =>
                this.updateSetting('general.defaultProjectType', projectType)
              }
            />

            <SectionTitle>Privacy</SectionTitle>
            <PixelShifter x={5} reason="Slightly intend in section">
              <FormField
                label="Enable anonymous usage tracking"
                focusOnClick={false}
              >
                <Toggle
                  isToggled={newSettings.privacy.enableUsageTracking}
                  onToggle={value =>
                    this.updateSetting('privacy.enableUsageTracking', value)
                  }
                />
              </FormField>
            </PixelShifter>

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

const SectionTitle = styled(Heading).attrs({
  size: 'small',
})`
  padding-bottom: 20px;
`;

const Actions = styled.div`
  text-align: center;
  padding-bottom: 16px;
`;

const mapStateToProps = state => {
  return {
    projectHomePath: getDefaultProjectPath(state),
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