// @flow
import { defineMessages } from 'react-intl';

const messages = {
  step: {
    installingCliTool: {
      id: 'createNewProjectWizard.buildPane.step.installingCliTool',
      defaultMessage: 'Installing build tool',
      description:
        'Text "Installing build tool" for the installingCliTool step',
    },
    creatingProjectDirectory: {
      id: 'createNewProjectWizard.buildPane.step.creatingProjectDirectory',
      defaultMessage: 'Creating project directory',
      description:
        'Text "Creating project directory" for the creatingProjectDirectory step',
    },
    installingDependencies: {
      id: 'createNewProjectWizard.buildPane.step.installingDependencies',
      defaultMessage: 'Installing dependencies',
      description:
        'Text "Installing dependencies" for the installingDependencies step',
    },
    guppification: {
      id: 'createNewProjectWizard.buildPane.step.guppification',
      defaultMessage: 'Persisting project info',
      description: 'Text "Persisting project info" for the guppification step',
    },
    takeAWhile: {
      id: 'createNewProjectWizard.buildPane.step.takeAWhile',
      defaultMessage: 'This step can take a while...',
      description: 'Text to tell the user the step might take a while',
    },
  },
  main: {
    created: {
      id: 'createNewProjectWizard.buildPane.main.created',
      defaultMessage: 'Project Created!',
      description: 'Text when the project is created',
    },
    building: {
      id: 'createNewProjectWizard.buildPane.main.building',
      defaultMessage: 'Building Project...',
      description: 'Text when the project is being built',
    },
  },
  error: {
    insufficientData: {
      id: 'createNewProjectWizard.buildPane.error.insufficientData',
      defaultMessage:
        'Tried to build project with insufficient data. See console for more info',
      description: 'Error message when data is insufficient',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
