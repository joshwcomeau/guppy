// @flow
import { defineMessages } from 'react-intl';

const messages = {
  dialog: {
    selectDirectory: {
      id: 'createNewProjectWizard.projectPath.dialog.selectDirectory',
      defaultMessage: 'Select the directory of Project',
      description: 'Text for "Select the directory of Project"',
    },
    openDirectory: {
      id: 'createNewProjectWizard.projectName.main.openDirectory',
      defaultMessage: 'openDirectory',
      description: 'Text For "openDirectory"',
    },
  },
  main: {
    createdIn: {
      id: 'createNewProjectWizard.projectPath.main.createdIn',
      defaultMessage: 'Project will be created in ',
      description: 'Text for "Project will be created in "',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
