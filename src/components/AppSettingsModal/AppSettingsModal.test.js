import React from 'react';
import { remote } from 'electron'; // mocked
import fs from 'fs';
import { mount, shallow } from 'enzyme';

import { AppSettingsModal } from './AppSettingsModal';
import Toggle from '../Toggle';
import DirectoryPicker from '../DirectoryPicker';
import ProjectTypeSelection from '../ProjectTypeSelection';

const { dialog } = remote;

describe('AppSettingsModal component', () => {
  let wrapper;
  let instance;
  let mockedHideModal;
  let mockedSaveAppSettings;
  let mockFs;

  const DEFAULT_SETTINGS = {
    general: {
      defaultProjectPath: 'user/guppy',
      defaultProjectType: 'create-react-app',
    },
    privacy: {
      enableUsageTracking: true,
    },
  };

  beforeEach(() => {
    mockFs = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    mockedHideModal = jest.fn();
    mockedSaveAppSettings = jest.fn();
    wrapper = shallow(
      <AppSettingsModal
        isVisible={true}
        settings={DEFAULT_SETTINGS}
        hideModal={mockedHideModal}
        saveAppSettings={mockedSaveAppSettings}
      />
    );
    instance = wrapper.instance();
  });

  afterEach(() => {
    mockFs.mockRestore();
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show dialog if path not exists', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    instance.saveSettings({ preventDefault: jest.fn() });

    expect(dialog.showErrorBox).toHaveBeenCalledWith(
      "Path doesn't exist.",
      'Please check your default project path or use the directory picker to select the path.'
    );
  });

  it('should update & save settings', () => {
    instance.updateSetting('general.defaultProjectType', 'gatsby');

    instance.saveSettings({ preventDefault: jest.fn() });
    expect(mockedSaveAppSettings).toHaveBeenCalledWith({
      ...DEFAULT_SETTINGS,
      general: {
        ...DEFAULT_SETTINGS.general,
        defaultProjectType: 'gatsby',
      },
    });
  });

  it('should update path setting', () => {
    const picker = wrapper.find(DirectoryPicker);
    const pickedPath = '/new/path';
    instance.updateSetting = jest.fn();
    picker.prop('onSelect')(pickedPath);

    expect(instance.updateSetting).toHaveBeenCalledWith(
      'general.defaultProjectPath',
      pickedPath
    );
  });

  describe('activeField update', () => {
    beforeEach(() => {
      // Mounted to DOM as we'd like to trigger events
      wrapper = mount(
        <AppSettingsModal
          isVisible={true}
          settings={DEFAULT_SETTINGS}
          hideModal={mockedHideModal}
          saveAppSettings={mockedSaveAppSettings}
        />
      );
      instance = wrapper.instance();
    });

    it('should set "tracking" on privacy toggle', () => {
      const toggle = wrapper.find(Toggle);
      toggle.simulate('click');
      expect(wrapper.state('activeField')).toEqual('tracking');
    });

    it('should set "directory" on focus', () => {
      const picker = wrapper.find(DirectoryPicker);
      wrapper.setState({ activeField: 'tracking' }); // Preset to tracking
      expect(wrapper.state('activeField')).toEqual('tracking');
      picker.prop('onFocus')();
      expect(wrapper.state('activeField')).toEqual('directoryPicker');
    });

    it('should set "projectType" on select', () => {
      const selection = wrapper.find(ProjectTypeSelection);
      instance.updateSetting = jest.fn();
      selection.prop('onProjectTypeSelect')('gatsby');

      expect(wrapper.state('activeField')).toEqual('projectType');
      expect(instance.updateSetting).toHaveBeenCalledWith(
        'general.defaultProjectType',
        'gatsby'
      );
    });
  });
});
