// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    title: {
      id: 'projectConfigurationModel.main.title',
      defaultMessage: 'Project settings',
      description: 'Title for the whole "Project settings" part',
    },
    save: {
      id: 'projectConfigurationModel.main.save',
      defaultMessage: 'Save Project',
      description: 'Text for the "Save Project" button',
    },
    waitingPrompt: {
      id: 'projectConfigurationModel.main.waitingPrompt',
      defaultMessage: 'Waiting for pending tasks to finish…',
      description: 'Prompt message if there are pending tasks to be finished',
    },
  },
  projectName: {
    title: {
      id: 'projectConfigurationModel.projectName.title',
      defaultMessage: 'Project name',
      description: 'Title for the "Project name" part',
    },
  },
  projectIcon: {
    title: {
      id: 'projectConfigurationModel.projectIcon.title',
      defaultMessage: 'Project Icon',
      description: 'Title for the "Project Icon" part',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
