// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    title: {
      id: 'appSettingsModal.main.title',
      defaultMessage: 'Preferences',
      description: 'Title for the whole "Preferences" part',
    },
    errorMessage: {
      id: 'appSettingsModal.main.errorMessage',
      defaultMessage: "Path doesn't exist.",
      description: "Error message if project folder doesn't exist",
    },
    errorPrompt: {
      id: 'appSettingsModal.main.errorPrompt',
      defaultMessage:
        'Please check your default project path or use the directory picker to select the path.',
      description: "Prompt message if project folder doesn't exist",
    },
    save: {
      id: 'appSettingsModal.main.save',
      defaultMessage: 'Save',
      description: 'Text for the save button',
    },
  },
  general: {
    title: {
      id: 'appSettingsModal.general.title',
      defaultMessage: 'General',
      description: 'Title for the "General" part',
    },
    projectPath: {
      id: 'appSettingsModal.general.projectPath',
      defaultMessage: 'Default Project Path',
      description: 'Title for "Default Project Path" under the "General" part',
    },
    projectType: {
      id: 'appSettingsModal.general.projectType',
      defaultMessage: 'Default Project Type',
      description: 'Title for "Default Project Type" under the "General" part',
    },
  },
  privacy: {
    title: {
      id: 'appSettingsModal.privacy.title',
      defaultMessage: 'Privacy',
      description: 'Title for the "Privacy" part',
    },
    enableUsageTracking: {
      id: 'appSettingsModal.privacy.enableUsageTracking',
      defaultMessage: 'Enable anonymous usage tracking',
      description:
        'Title for "Enable anonymous usage tracking" under the "privacy" part',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
